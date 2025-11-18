# Intune Portal on Arch Linux

## Overview

Running the Microsoft Intune Company Portal on Arch Linux presents unique challenges due to limited official Linux support. This guide documents the attempted approaches and troubleshooting steps for getting Intune enrollment working on Arch Linux.

## Background

Microsoft Intune is an enterprise mobility management (EMM) platform that allows organizations to manage devices and applications. While Microsoft has made strides in Linux support, Arch Linux users face specific compatibility issues that require creative solutions.

## Prerequisites

Before attempting to run the Intune portal on Arch, ensure you have:

- Updated Arch Linux system: `sudo pacman -Syu`
- AUR helper installed (yay, paru, etc.)
- Basic understanding of package management on Arch
- Admin/sudo privileges
- Network connectivity to Microsoft services

## Attempted Solutions

### Method 1: Microsoft Edge Browser Approach

The Intune Company Portal has a web-based interface accessible through Microsoft Edge.

**Installation:**
```bash
# Install Microsoft Edge from AUR
yay -S microsoft-edge-stable-bin
```

**Steps:**
1. Open Microsoft Edge browser
2. Navigate to https://portal.manage.microsoft.com
3. Sign in with organizational credentials
4. Attempt device enrollment

**Status:** Partial success - Web portal accessible but device enrollment may have limitations

### Method 2: Intune App SDK

Attempt to use the Intune App SDK for Linux (if available).

**Investigation:**
- Microsoft's official Intune App SDK primarily targets iOS, Android, and Windows
- Linux support is limited to specific distributions (primarily Ubuntu/Debian-based)
- No official Arch Linux package available

**Status:** Limited - SDK not officially supported on Arch

### Method 3: Company Portal App (Snap/Flatpak)

**Snap Installation:**
```bash
# Install snapd
yay -S snapd
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap

# Search for Intune/Company Portal
snap search intune
```

**Flatpak Installation:**
```bash
# Install flatpak
sudo pacman -S flatpak

# Add Flathub repository
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# Search for Company Portal
flatpak search intune
```

**Status:** No official Company Portal snap or flatpak currently available

### Method 4: Wine/Proton for Windows App

Running the Windows version of Company Portal through Wine.

**Installation:**
```bash
# Install Wine
sudo pacman -S wine winetricks
```

**Steps:**
1. Download Company Portal Windows installer
2. Run through Wine: `wine CompanyPortal.exe`
3. Configure Wine prefix for modern Windows version

**Status:** Experimental - May encounter compatibility issues with device registration

### Method 5: Virtual Machine Approach

**Using QEMU/KVM:**
```bash
# Install virtualization packages
sudo pacman -S qemu virt-manager libvirt ebtables dnsmasq bridge-utils

# Enable libvirtd
sudo systemctl enable libvirtd
sudo systemctl start libvirtd
```

**Steps:**
1. Create Windows 10/11 VM using virt-manager
2. Install Company Portal in VM
3. Enroll VM as managed device

**Status:** Works but defeats purpose of running Linux natively

### Method 6: Ubuntu Compatibility Layer

**Using Ubuntu Base System:**
```bash
# Install necessary compatibility libraries
yay -S ubuntu-keyring
```

Attempt to run Ubuntu-based Intune tools using compatibility libraries.

**Status:** Complex - Dependency conflicts likely

## Current Challenges

1. **No Official Support**: Microsoft does not officially support Arch Linux for Intune enrollment
2. **Certificate Management**: Intune device certificates may not integrate properly with Arch's certificate store
3. **TPM Integration**: Trusted Platform Module (TPM) integration differs from supported distributions
4. **Package Dependencies**: Debian/RPM packages don't directly translate to Arch's pacman system

## Alternative Approaches

### Browser-Based Management

For organizations that primarily need web-based access:
- Use Microsoft Edge on Arch
- Access Intune portal through browser
- Manage policies through web interface

### Conditional Access Policies

Work with IT department to configure:
- Browser-based conditional access
- App-based authentication
- Certificate-based authentication without full enrollment

### Container-Based Isolation

**Using Docker:**
```bash
# Install Docker
sudo pacman -S docker
sudo systemctl enable docker
sudo systemctl start docker

# Run Ubuntu container with Intune tools
docker run -it ubuntu:latest
# Inside container: install Intune prerequisites
```

## Workarounds Being Tested

1. **Chromium with Intune Extension**: Test if Intune management extensions work in Chromium
2. **Manual Certificate Import**: Import Intune certificates manually into system trust store
3. **Network-Level Compliance**: Use network policies instead of device enrollment
4. **Hybrid Approach**: Dual-boot with supported distribution for Intune enrollment

## Resources and References

- [Microsoft Intune Documentation](https://learn.microsoft.com/en-us/mem/intune/)
- [Arch Wiki - Virtualization](https://wiki.archlinux.org/title/Virtualization)
- [Microsoft Edge for Linux](https://www.microsoft.com/en-us/edge)
- [Arch User Repository (AUR)](https://aur.archlinux.org/)

## Community Solutions

Check these resources for community-driven solutions:
- [Arch Forums](https://bbs.archlinux.org/)
- [r/archlinux subreddit](https://www.reddit.com/r/archlinux/)
- [Microsoft Tech Community - Intune](https://techcommunity.microsoft.com/t5/microsoft-intune/ct-p/microsoft-intune)

## Next Steps

1. Contact organization's IT department to discuss Arch Linux support
2. Request information about alternative enrollment methods
3. Consider using supported distribution in VM for critical Intune-managed applications
4. Monitor Microsoft's Linux support roadmap for future Arch compatibility

## Conclusion

While getting full Intune Company Portal functionality on Arch Linux remains challenging, several workarounds exist depending on your organization's requirements. The browser-based approach using Microsoft Edge provides the most straightforward access to Intune services, while VM-based solutions offer complete compatibility at the cost of native performance.

Continue to monitor developments in Microsoft's Linux support and community solutions as the landscape evolves.

---

*Last Updated: November 2025*
*Status: Work in Progress*
