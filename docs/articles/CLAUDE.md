# PiKVM Stealth Setup - Claude Code Configuration

This file instructs Claude Code on how to automate PiKVM configuration tasks from your iMac terminal.

## Project Context

**Goal:** Configure a PiKVM multi-machine KVM-over-IP system where target machines are unaware they're connected to a KVM.

**Architecture:**
```
Target Machines ← PiKVM Switch ← PiKVM ← iMac (Ethernet) ← Claude Code
```

**Key Requirement:** Configuration must be applied BEFORE target machines connect for the first time (USB descriptors and EDID must be cached correctly).

## PiKVM Details

- **Device:** PiKVM V4 Mini or Plus
- **Default IP:** Check OLED display on device
- **Default login:** admin/admin (root/root)
- **SSH:** `ssh root@pikvm.local` or `ssh root@<IP>`
- **Key ports:**
  - Ethernet: For iMac connection
  - HDMI input: For Hagibis capture card
  - HDMI output (V4 Plus): For pass-through monitor/capture
  - USB OTG: For HID (keyboard/mouse)

## Available Claude Code Tasks

### Task 1: SSH into PiKVM and Test Connection

**Trigger:** `claude "test connection to pikvm"`

**What Claude Code will do:**
1. SSH into PiKVM at pikvm.local
2. Run `whoami` to verify root access
3. Check PiKVM OS version
4. Report connectivity status

```bash
ssh root@pikvm.local "whoami && cat /etc/os-release"
```

### Task 2: Apply PiKVM Configuration

**Trigger:** `claude "configure pikvm with stealth settings"`

**What Claude Code will do:**
1. SSH into PiKVM
2. Enable read-write mode (`rw`)
3. Create/edit `/etc/kvmd/override.yaml` with correct USB descriptors (generic, not "PiKVM")
4. Set up HID interfaces, audio, GPIO
5. Enable H.264 boost for low-latency video
6. Disable mass storage (security)
7. Return to read-only (`ro`)
8. Reboot PiKVM
9. Wait for boot and verify config applied

**Expected output:**
```
✓ SSH connection successful
✓ Read-write mode enabled
✓ override.yaml created with:
  - USB manufacturer: Standard
  - USB product: USB Keyboard
  - H.264 boost enabled
  - HID interfaces configured
  - GPIO scheme configured
✓ Read-only mode restored
✓ Reboot initiated
✓ Configuration applied
```

### Task 3: Verify Configuration

**Trigger:** `claude "verify pikvm configuration"`

**What Claude Code will do:**
1. SSH into PiKVM
2. Check `/etc/kvmd/override.yaml` exists and is valid
3. Run `kvmd -M` to list non-default overrides
4. Check encoding settings
5. Verify no errors in logs

```bash
ssh root@pikvm.local "cat /etc/kvmd/override.yaml && echo '---' && kvmd -M"
```

### Task 4: Manage EDID Configuration

**Trigger:** `claude "export edid from pikvm monitor"`

**What Claude Code will do:**
1. SSH into PiKVM
2. Locate the EDID data for connected monitor
3. Extract EDID binary/hex
4. Save to local file for reference
5. Report monitor model and specs

**Note:** EDID assignment to switch ports must be done via PiKVM web UI for now.

### Task 5: Check PiKVM Connectivity From iMac

**Trigger:** `claude "test pikvm network connection"`

**What Claude Code will do:**
1. Ping pikvm.local
2. Test HTTPS connection to web UI
3. Report latency measurements if in web UI
4. Verify Ethernet link status

```bash
ping -c 4 pikvm.local
curl -k -I https://pikvm.local/
```

### Task 6: Create Configuration Backup

**Trigger:** `claude "backup pikvm configuration"`

**What Claude Code will do:**
1. SSH into PiKVM
2. Copy `/etc/kvmd/override.yaml` to local backup
3. Export current configuration via `kvmd -m`
4. Save to timestamped file in repo
5. Git add/commit the backup

```bash
ssh root@pikvm.local "cat /etc/kvmd/override.yaml" > backups/pikvm-config-$(date +%Y%m%d-%H%M%S).yaml
```

### Task 7: Rollback Configuration

**Trigger:** `claude "rollback pikvm to backup <backup-file>"`

**What Claude Code will do:**
1. Verify backup file exists
2. SSH into PiKVM
3. Enable read-write mode
4. Restore `/etc/kvmd/override.yaml` from backup
5. Reboot
6. Verify restoration

## Build/Deploy Commands

### Install/Test locally:
```bash
# Test SSH to PiKVM
ssh root@pikvm.local "whoami"

# Check PiKVM version
ssh root@pikvm.local "pacman -Q | grep kvmd"

# Monitor PiKVM logs (for debugging)
ssh root@pikvm.local "journalctl -u kvmd -f"
```

### Common PiKVM commands:
```bash
rw                  # Enable read-write mode
ro                  # Return to read-only
kvmd -m             # Show full configuration
kvmd -M             # Show non-default overrides
kvmd-override --set <key>=<value>  # Apply single override
pikvm-update        # Update PiKVM OS
systemctl restart kvmd  # Restart kvmd service
```

## Important Notes for Claude Code

1. **Order matters:** Config must be applied BEFORE target machines connect
2. **Reboot required:** Changes to override.yaml require reboot to take effect
3. **Read-write is temporary:** PiKVM filesystem is read-only for stability; always return to `ro` after edits
4. **SSH authentication:** Uses key-based auth if available, password if not
5. **Network:** PiKVM must be on same network as iMac (Ethernet preferred)
6. **Latency:** You can measure from web UI with `show_webrtc_latency=1` URL parameter

## File Locations in Repo

- **Guide:** `articles/pikvm-stealth-kvm-setup.md` (complete setup documentation)
- **Backups:** `backups/pikvm-config-*.yaml` (timestamped configuration backups)
- **Scripts:** `scripts/pikvm-*.sh` (optional bash helpers for PiKVM tasks)
- **This file:** `CLAUDE.md` (you are here)

## Keyboard Shortcuts for This Project

- `/test-pikvm` – Test SSH connection to PiKVM
- `/configure-pikvm` – Apply stealth configuration
- `/verify-config` – Verify configuration is correct
- `/backup-config` – Backup current configuration
- `/rollback <file>` – Restore from backup

## Next Steps After Configuration

1. ✅ Configure PiKVM with stealth USB descriptors
2. ✅ Extract monitor EDID via web UI
3. ✅ Assign EDID to all 4 switch ports
4. ✅ Connect target machines to switch for FIRST TIME
5. Measure latency in web UI with `?show_webrtc_latency=1`
6. Configure magic key for keyboard shortcuts
7. Set up OBS capture (if desired)

## Support

For detailed setup instructions, see: `articles/pikvm-stealth-kvm-setup.md`

For PiKVM docs: https://docs.pikvm.org/
