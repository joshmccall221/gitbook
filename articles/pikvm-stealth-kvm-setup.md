# PiKVM Stealth Setup: Complete Guide to Hidden KVM-over-IP

## Overview

This guide walks through setting up a PiKVM multi-machine KVM-over-IP system where target machines don't know they're talking to a KVM device. They see standard USB peripherals (keyboard, mouse) and a normal monitor EDID.

**Key Architecture:**
```
Target machine(s) ← PiKVM Switch ← PiKVM [HDMI out] → Hagibis Capture Card → iMac (USB) → OBS/Web Browser
                                        ↓
                                    Ethernet
                                        ↓
                                      iMac
```

## Prerequisites

- PiKVM V4 Mini or Plus with pre-loaded OS
- PiKVM Switch (hardware switch between target machines)
- Hagibis USB capture card
- Your real monitor (for EDID extraction)
- Ethernet cable
- iMac (or viewing machine)
- Moonlander Mark I keyboard (or compatible USB keyboard)

## Step-by-Step Setup

### Phase 1: Configure PiKVM (Before Plugging Into Targets)

#### 1. Power On and Get IP Address

1. Power on PiKVM via USB-C (V4 Mini) or 12V barrel (V4 Plus)
2. Wait for full boot (2-3 minutes)
3. Check the OLED display on top for the IP address
   - Example: `192.168.0.26`
   - Hostname: `pikvm`

#### 2. Access PiKVM via Web UI

1. Open browser on iMac and navigate to:
   - `https://pikvm.local/` or
   - `https://192.168.0.26/` (replace with your IP)

2. Login with default credentials:
   - Username: `admin`
   - Password: `admin`

3. Click **Terminal** to open web terminal

#### 3. Enable Read-Write Mode and Edit Config

In the terminal:

```bash
su -                    # Switch to root (password: root)
rw                      # Enable read-write mode
```

Now edit `/etc/kvmd/override.yaml` using nano or vi:

```bash
nano /etc/kvmd/override.yaml
```

**Paste this configuration:**

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
        cmd_append:
            - "--h264-boost"
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

**Key points in this config:**
- `manufacturer: Standard` and `product: USB Keyboard` – Makes USB devices look generic, not "PiKVM"
- `h264-boost` – Enables 60fps H.264 streaming for lowest latency
- `jiggler: enabled` – Keeps target machine awake
- `gpio` scheme – Allows toggling between HID modes via web UI

**Save the file:**
- In nano: `Ctrl+X`, then `Y`, then Enter

#### 4. Return to Read-Only and Reboot

```bash
ro                      # Return to read-only mode
reboot                  # Reboot PiKVM
```

**Wait for reboot** (watch OLED, should take ~1 minute)

### Phase 2: Extract and Configure Monitor EDID

#### 5. Plug Real Monitor Into PiKVM Pass-Through

1. Locate the **HDMI output port** on PiKVM's rear
2. Plug your real monitor's HDMI cable into PiKVM's HDMI out
3. Power on the monitor

PiKVM will read your monitor's EDID (display capabilities like resolution, refresh rate, color space).

#### 6. Upload EDID to PiKVM Web UI

1. In PiKVM web UI, go to **System** → **Video** settings
2. Look for **EDID configuration** section
3. PiKVM should auto-detect your monitor's EDID
4. Save/upload the EDID

#### 7. Assign EDID to All 4 Switch Ports

1. In PiKVM web UI, go to **Switch** configuration (or GPIO view)
2. For each of the 4 ports on the switch, assign the same EDID you just saved
3. This ensures target machines see your real monitor's specs, not "PiKVM"

**Result:** When target machines connect, they'll think they're talking to your actual monitor, not a KVM device.

#### 8. Unplug Monitor from Pass-Through

Once EDID is assigned to all ports, you can unplug the real monitor.

### Phase 3: Connect Target Machines (First Time Only)

#### 9. Physically Connect Target Machines to PiKVM Switch for the FIRST TIME

**Critical:** Do this AFTER step 8. The USB descriptors and EDID must be correct before targets see PiKVM.

1. For each target machine:
   - Connect HDMI from target → PiKVM Switch
   - Connect USB from target (keyboard/mouse ports) → PiKVM Switch
   - The switch routes all signals to PiKVM

2. Power on target machines

3. **Target machines now cache:**
   - USB descriptors: "Standard USB Keyboard", "USB Mouse" (not "PiKVM")
   - EDID: Your real monitor's specs (not "PiKVM")
   - Result: They're "tricked" into thinking they're normal peripherals

**Once cached, even if you change configs later, machines won't forget the original USB/EDID identifiers.**

### Phase 4: Set Up iMac Connection and Control

#### 10. Connect iMac to PiKVM via Ethernet

1. Plug Ethernet cable from iMac's Ethernet port → PiKVM's Ethernet port
2. iMac should get a DHCP IP on that interface
3. Test: `ping pikvm.local` from iMac terminal

#### 11. Access PiKVM Web UI From iMac

Open browser on iMac:
- `https://pikvm.local/` or
- `https://192.168.0.26/`

#### 12. Configure Video Mode for Lowest Latency

1. In PiKVM web UI, go to **System** → **Video**
2. Select **WebRTC H.264** mode (default)
3. Set **H.264 gop = 0**
4. Bitrate can stay at default (5000 kbps)

**Expected latency:** 35-50 milliseconds (imperceptible)

#### 13. Switch Between Target Machines

1. Use the **PiKVM Switch** (physical toggle or web UI GPIO controls) to select which target machine is active
2. The web UI shows video from the active machine
3. Your keyboard/mouse input goes to the active machine

#### 14. Handle macOS Keyboard Shortcuts

By default, some macOS shortcuts intercept before reaching PiKVM:
- `Cmd+Q`, `Cmd+Tab`, `Cmd+Space`, etc.

**Solutions:**
- Use `Ctrl+` instead of `Cmd+` (most target machines use Ctrl)
- Or configure a "magic key" in PiKVM settings to toggle keyboard focus
- Or use Full Screen mode in browser

## Optional: Capture in OBS

If you want to record/stream the KVM session:

1. Plug Hagibis capture card into iMac USB port
2. In OBS, add video source: Hagibis USB device
3. PiKVM's HDMI output → Hagibis captures it
4. OBS displays the capture as a source
5. Still use PiKVM web UI for keyboard/mouse control

## Verification Checklist

- [ ] PiKVM boots and shows IP on OLED
- [ ] override.yaml config loaded and PiKVM rebooted
- [ ] Real monitor EDID extracted and assigned to all 4 switch ports
- [ ] Target machines connected to switch for first time (USB/HDMI cached correctly)
- [ ] iMac connected to PiKVM via Ethernet
- [ ] iMac can access PiKVM web UI at `https://pikvm.local/`
- [ ] Video mode set to WebRTC H.264 with gop=0
- [ ] Can switch between target machines via switch
- [ ] Can control active machine with Moonlander keyboard
- [ ] Target machines show no PiKVM identification in system settings

## Troubleshooting

### Machine thinks it's connected to "PiKVM"
- **Cause:** Config wasn't in place before first connection
- **Solution:** Reflash machine OS or manually change USB device descriptors in Windows/Linux

### No video output on iMac web UI
- **Cause:** Video mode not compatible with browser
- **Solution:** Try Direct H.264 or MJPEG mode from System menu

### Keyboard input not working
- **Cause:** macOS intercepting shortcuts, or HID interface not enabled
- **Solution:** 
  - Use Ctrl shortcuts instead of Cmd
  - Check GPIO view in web UI to ensure HID ports are enabled
  - Verify override.yaml HID section is correct

### Poor video quality/latency
- **Cause:** H.264 boost not enabled or gop not set to 0
- **Solution:** Verify override.yaml has `--h264-boost` flag and gop = 0

## References

- [PiKVM V4 Quick Start](https://docs.pikvm.org/v4/)
- [PiKVM Video Modes & Latency](https://docs.pikvm.org/video/)
- [PiKVM Identification (USB/EDID)](https://docs.pikvm.org/id/)
- [PiKVM Switch Documentation](https://docs.pikvm.org/switch/)

## Network Topology Diagram

```
┌─────────────────────────────────────────────┐
│  Target Machines (Windows/Linux/etc)        │
│  - See: Standard USB Keyboard               │
│  - See: Standard USB Mouse                  │
│  - See: Your Real Monitor EDID              │
│  - No idea they're on a KVM                 │
└────────────────┬────────────────────────────┘
                 │ HDMI + USB
                 ▼
        ┌────────────────┐
        │  PiKVM Switch  │
        │ (routes signal)│
        └────────┬───────┘
                 │ HDMI to PiKVM
                 ▼
         ┌──────────────────────────┐
         │      PiKVM V4            │
         │ (HDMI Capture + Control) │
         └──────────┬───────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        │ Ethernet               │ HDMI out
        │                        │
        ▼                        ▼
    ┌────────┐          ┌──────────────┐
    │  iMac  │          │ Hagibis Card │
    │ (view  │          │ (optional)   │
    │ + ctrl)│          │   → OBS      │
    └────────┘          └──────────────┘
```

## Summary

You've created a **stealth KVM system** where:
1. Target machines think they're connected to normal peripherals
2. iMac controls them via PiKVM web interface with 35-50ms latency
3. Video is captured HDMI-in to PiKVM, then streamed to iMac browser
4. Can switch between multiple target machines with the PiKVM Switch
5. Optional OBS capture for recording/streaming

Enjoy your KVM-over-IP setup!
