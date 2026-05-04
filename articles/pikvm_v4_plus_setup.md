# Setting Up a PiKVM V4 Plus: Stealth KVM-over-IP with Multi-Machine Switching

I recently set up a PiKVM V4 Plus to manage several machines remotely. The goal was a "stealth" configuration where target machines have no idea they're connected to a KVM — they see generic USB peripherals and a normal monitor EDID. Here's what I learned.

## The Setup

**Hardware:**
- PiKVM V4 Plus (Raspberry Pi Compute Module 4)
- PiKVM Switch (4-port)
- Hagibis USB capture card (used as the "monitor" for EDID)
- iMac as the control machine

**Architecture:**
```
Target Machines → PiKVM Switch → PiKVM V4 Plus → Web Browser (iMac/Phone)
```

## Step 1: Stealth USB Configuration

The first thing to configure is making the PiKVM look like generic USB peripherals to target machines. Edit `/etc/kvmd/override.yaml`:

```bash
rw  # enable read-write mode
nano /etc/kvmd/override.yaml
```

```yaml
otg:
    manufacturer: Standard
    product: USB Keyboard
    vendor_id: 0x0000
    product_id: 0x0000
    serial: GENERIC00000001
    devices:
        audio:
            enabled: true

kvmd:
    streamer:
        forever: true
        h264_gop:
            default: 0
    hid:
        jiggler:
            enabled: true
    msd:
        type: disabled
    gpio:
        drivers:
            otgconf:
                type: otgconf
        scheme:
            hid.usb0:
                driver: otgconf
                mode: output
                pin: hid.usb0
                pulse: false
            hid.usb1:
                driver: otgconf
                mode: output
                pin: hid.usb1
                pulse: false
            hid.usb2:
                driver: otgconf
                mode: output
                pin: hid.usb2
                pulse: false
            uac2.usb0:
                driver: otgconf
                mode: output
                pin: uac2.usb0
                pulse: false
        view:
            table:
                - ["#Keyboard", "#hid.usb0", hid.usb0]
                - ["#Absolute Mouse", "#hid.usb1", hid.usb1]
                - ["#Relative Mouse", "#hid.usb2", hid.usb2]
                - ["#Mic Audio", "#uac2.usb0", uac2.usb0]
```

```bash
ro      # return to read-only
reboot
```

**Important:** `--h264-boost` is documented in some guides but is **not a valid flag** in current versions of ustreamer. It will crash the streamer. Use `h264_gop: default: 0` instead for low latency.

## Step 2: Extract EDID from Your Display

On the V4 Plus there are two HDMI outputs:
- **HDMI OUT 1** — secondary output
- **HDMI OUT 2** — pass-through port (use this for EDID extraction)

Plug your monitor (or capture card) into **HDMI OUT 2**, then extract its EDID:

```bash
rw
kvmd-edidconf -f /etc/kvmd/tc358743-edid.hex \
    --import /sys/class/drm/card0-HDMI-A-2/edid \
    --apply
ro
systemctl restart kvmd
```

`switch-edid.hex` is a symlink to `tc358743-edid.hex`, so both the PiKVM capture device and the switch ports get updated in one shot.

## Step 3: Connect Target Machines

Connect target machines to the switch **after** the EDID and USB config are in place. This is critical — machines cache USB descriptors and EDID on first connection. If PiKVM is already configured correctly they'll never know it's a KVM.

## Step 4: Troubleshooting No Signal on Some Ports

I had ports 3 and 4 showing "no signal" even though the USB (mouse) was working fine. Causes:

- **Windows display mode** — Windows may treat the PiKVM as a secondary display and extend to it rather than use it as primary. Fix: Display Settings → identify which display is PiKVM → "Make this my main display" → "Show only on X".
- **Resolution mismatch** — force 1920×1080 @ 60Hz on target machines.

## Step 5: Connect PiKVM to WiFi

The V4 Plus has built-in WiFi but the web UI doesn't expose a WiFi config panel. Do it via SSH:

```bash
rw
wpa_passphrase 'YourSSID' 'YourPassword' \
    > /etc/wpa_supplicant/wpa_supplicant-wlan0.conf

# Add security settings to the top of the file
python3 -c "
config = '''ctrl_interface=/run/wpa_supplicant
ctrl_interface_group=wheel
update_config=1

network={
    ssid=\\\"YourSSID\\\"
    psk=<hash from wpa_passphrase>
    key_mgmt=WPA-PSK
    proto=RSN WPA
    pairwise=CCMP TKIP
    group=CCMP TKIP
}
'''
open('/etc/wpa_supplicant/wpa_supplicant-wlan0.conf','w').write(config)
"

systemctl enable --now wpa_supplicant@wlan0

cat > /etc/systemd/network/wlan0.network << 'EOF'
[Match]
Name=wlan0

[Network]
DHCP=yes
EOF

networkctl reload
ro
```

Check the assigned IP:
```bash
ip addr show wlan0
```

## Step 6: VNC Access

PiKVM supports VNC on port 5900, but **not all clients work**. The official docs specifically call out these as incompatible: RealVNC, Remmina, Guacamole, Vinagre.

**Use TigerVNC** (desktop) or **bVNC** (iOS/Android).

```bash
# Enable VNC
rw
systemctl enable --now kvmd-vnc
ro
```

Credentials are configured in `/etc/kvmd/vncpasswd`:
```
admin -> admin:admin
```

Honestly, the **web UI is better than VNC** — just open `https://<pikvm-ip>/` in any browser.

## Key Lessons

1. Don't use `--h264-boost` — it's not a valid ustreamer flag in current builds
2. EDID and USB config must be in place **before** target machines first connect
3. On V4 Plus, use **HDMI OUT 2** for monitor pass-through/EDID extraction
4. Windows machines may need display settings adjusted to use PiKVM as primary display
5. Use TigerVNC, not RealVNC — the PiKVM docs are explicit about this
6. The web UI (`https://pikvm.local`) works great on phones once WiFi is configured
