# The Wired Operator: How a Friend Computes

*A portrait of an AI-native homelab built around control, visibility, and autonomous agents*

---

I have a friend who has spent years quietly building something unusual. Not a data center. Not a startup. A personal computing environment so deeply integrated — hardware, software, and AI agents all talking to each other — that it's hard to describe without sounding like science fiction. This is my attempt to document it, and show you how to build your own version.

He insisted on staying anonymous. I've stripped company names and identifying details. What remains is the philosophy, the stack, and the instructions.

---

## The Philosophy

Most people use their computers. He orchestrates his.

The distinction matters. Using a computer means you are the one switching windows, copying text, running commands. Orchestrating means you define intent at a high level and delegate execution — to scripts, to agents, to automation — and only intervene when something genuinely needs a human decision.

He did not arrive here overnight. The progression was: power user → homelab → KVM fleet → AI agents → persistent cross-machine memory. Each layer solved a problem the previous one created.

> *"PiKVM is the input when remote, KM switch when local."*

> *"Claude goes where it wants."*

---

## Hardware

### The Machines

Multiple headless Mac Minis (the workhorses), a MacBook (the mobile controller), and an Apple Vision Pro (spatial workspace). The Minis run 24/7 and handle compute, builds, agents, and services.

**To follow along:** Start with one Mac Mini as a dedicated headless server. You can control it entirely over the network — you don't need a monitor attached permanently.

### The KVM Layer

A fleet of **PiKVM V4 Plus** units with PiKVM Switches handle all target machine access. Each PiKVM sits between him and the target machines. He never physically touches the targets.

**What PiKVM gives you:**
- Web UI to see and control any machine from a browser
- Keyboard/mouse emulated over USB (target sees "Standard USB Keyboard", not PiKVM)
- Clipboard API — paste text programmatically to any target
- OCR via API — read text off the screen without screen sharing
- ATX power control — reboot machines remotely

**[PiKVM V4 Plus](https://pikvm.org/buy) — ~$350. The switch is a separate add-on for multi-machine setups.**

### The Video Layer

A hardware **HDMI matrix** sits between the targets and everything else. Each target's video output gets split:

1. **4K copy → Zowiebox** (NDI hardware encoder) → high-quality NDI stream → his custom viewer app
2. **Downscaled 1080p → PiKVM** → control layer + Claude-readable feed
3. **Pass-through → physical monitor** (when sitting at desk)

This is the key insight: **the KVM layer and the display layer are separate.** PiKVM handles control. The NDI stream handles high-quality display. You don't have to choose between them.

**To follow along at minimum viable scale:** Skip the HDMI matrix and Zowiebox. PiKVM alone is the 80% solution. Add the NDI layer later if you need 4K quality.

### The Spatial Layer

Apple Vision Pro runs **Immersed** for a five-monitor virtual workspace. **BetterDisplay** manages resolution scaling across physical and virtual displays. **AVD (Apple Virtual Display)** gives a native macOS display inside the headset.

---

## Mac Software Stack

### Terminal & Multiplexing

**[Zellij](https://zellij.dev/)** replaced tmux. The learning curve is real but short. Floating panes, better session management, and a plugin ecosystem that tmux cannot match.

```bash
brew install zellij
```

**[Ghostty](https://ghostty.org/)** is the terminal emulator. Fast, native, GPU-accelerated.

**Cazmux** — a fork of [cmux](https://github.com/ericblue/cmux-session-manager) — ties it together. Multi-agent terminal coordination, biometric auth on remote Zellij connections, and an agent-accessible browser tab. This is where his Claude agents live.

### Window Management

**[Aerospace](https://github.com/nickcoutsos/keyswitch-layout-editor)** — tiling window manager for macOS. Think i3 but for macOS. Assign workspaces, move windows with keyboard shortcuts, never touch the mouse for navigation.

```bash
brew install --cask aerospace
```

**WindowPilot** — his own app. Searches and activates any open browser tab, Zellij pane, or tmux pane across Ghostty/iTerm2/Cazmux with a keypress. As of now it's not public, but the concept is achievable with [Raycast](https://www.raycast.com/) + custom scripts for window activation.

**[OpenIn](https://apps.apple.com/us/app/openin-4/id1643649331)** — routes links to the right app automatically. Clicks a GitHub link? Opens in your preferred browser profile. Clicks a Zoom link? Skips the browser entirely.

### Input & Voice

**[Wispr Flow](https://wisprflow.ai/)** — voice typing everywhere. Dictate to Claude, to messages, to terminals. Push-to-talk or always-on. Replaces most keyboard typing for prose.

**[TextSniper](https://textsniper.app/)** — OCR anywhere on screen. Combined with PiKVM, you can OCR text off a target machine's display and paste it into a local app. He used this to extract a FileVault recovery key from a headless Mac Mini.

```
TextSniper shortcut → aim at PiKVM video feed → text copied to clipboard
```

### Password & Auth

**1Password** wired into scripts via biometric auth. Claude built a FileVault unlock automation: script prompts for Touch ID, uses `expect` to type the password into the remote prompt. Claude never sees the password — it only sees the script structure.

---

## The PiKVM Fleet

### Stealth Configuration

Before target machines connect for the first time, PiKVM must be configured to present as generic peripherals. Once a machine caches USB descriptors, it remembers them.

Edit `/etc/kvmd/override.yaml` on the PiKVM:

```yaml
otg:
    manufacturer: Standard
    product: USB Keyboard
    vendor_id: 0x0000
    product_id: 0x0000
    serial: GENERIC00000001
```

**Write this via base64 over SSH** — heredoc strips double-quotes from YAML and breaks GPIO table entries:

```bash
# On your local machine:
cat override.yaml | base64 | tr -d '\n' > /tmp/b64

# Then on PiKVM:
echo '<paste base64>' | base64 -d > /etc/kvmd/override.yaml
```

### Network Boot

His PiKVMs boot from a NAS when on-network and fall back to microSD when off. This means he can update all of them centrally and reboot to recover without touching microSD cards.

**To follow along:** This requires a TrueNAS or similar NAS with PXE boot configured. Start with local microSD. Add network boot later.

### ESOPI — EyeScreamOverPi

His own macOS app that turns the PiKVM fleet into a unified control wall:

- Thumbnail view of all machines simultaneously
- Mouse "between" machines like a software KM switch
- Focus one machine for fullscreen view and control
- Send clipboard text to one machine or broadcast to all
- Switch-aware: shows port buttons when a PiKVM has a switch attached

This is the layer that makes operating 4+ machines feel like using one.

**To follow along without ESOPI:** The PiKVM web UI handles one machine at a time. Open multiple browser tabs for multiple machines. It's manual but functional.

### ChromaNDI

His macOS/iOS app for consuming NDI streams from the Zowiebox units. Gives him 4K30 views of target machines without going through PiKVM's 1080p capture limit.

**To follow along:** [OBS](https://obsproject.com/) with NDI plugin can consume NDI streams. Free. Gets you the same feed without the custom app.

### Key Workflow: TextSniper + PiKVM OCR

One of the most practical tricks: use TextSniper aimed at the PiKVM browser window to OCR text off a target machine's screen, then paste it locally. No screen sharing required, works on machines with no software installed.

---

## The Agent Layer

This is where it gets unusual.

### OpenMemory / mem0

A self-hosted [mem0](https://github.com/mem0ai/mem0) instance exposed as an MCP server. Every Claude agent on every machine connects to it. When one agent learns something — a mistake, a pattern, a preference — that knowledge is written to mem0 as a "ReadOnlyMemory" (ROM) and all other agents can read it on their next invocation.

```
Agent on Machine A learns: "don't use --h264-boost, it crashes ustreamer"
       ↓
Written to mem0 (ROM)
       ↓
Agent on Machine B already knows this next time it touches PiKVM config
```

**This is the missing piece most people skip.** Without shared memory, every agent session starts from zero. With it, your agent fleet accumulates institutional knowledge.

**To set up mem0:**

```bash
pip install mem0ai
# Self-host via Docker or use their cloud tier
# Expose via MCP server for Claude Code
```

### Named Agents in Cazmux/Zellij

Running agents are persistent Zellij sessions, always warm, waiting for work:

- **WindowPilot** — reliable generalist, handles cross-machine coordination
- **gitrdun** — git operations (described as "the laziest mofo")
- **Bench warmers** — idle agents in standby Zellij panes

Agents assign work to each other. When one hits a blocker, it hands off. Claude can't push via git token? It pushes files via the GitHub API `create contents` endpoint instead. It figures out the workaround.

### Local LLM Inference

Building a local inference cluster to handle lower-stakes tasks and preserve Claude Pro tokens for harder problems. The economics: use local for "write this script," use Claude for "debug this subtle race condition."

**To follow along:** [Ollama](https://ollama.ai/) on a Mac Mini is the fastest path to local LLM inference.

```bash
brew install ollama
ollama pull llama3
```

### Voice Interface (In Progress)

Current: push-to-talk via Wispr Flow → Claude.
Goal: always-on live call-and-response, no push-to-talk.

[OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime) or a local Whisper + TTS loop are the two paths forward.

---

## The Stack at a Glance

| Layer | Tool | Follow-Along Alternative |
|-------|------|--------------------------|
| KVM | PiKVM V4 Plus | — (no substitute) |
| Video | HDMI Matrix + Zowiebox NDI | Skip for now |
| Terminal | Zellij + Ghostty | tmux + iTerm2 |
| Windows | Aerospace | Raycast window management |
| Agents | Cazmux + named Claude sessions | tmux + Claude Code |
| Memory | Self-hosted mem0 via MCP | Claude's built-in memory (limited) |
| Voice | Wispr Flow | Whisper.cpp |
| OCR | TextSniper + PiKVM | macOS Live Text |
| Display | Immersed + AVD | External monitors |
| Boot | NAS network boot | microSD |
| Control app | ESOPI | PiKVM web UI (multiple tabs) |

---

## Where to Start

If I were starting from scratch copying this setup, the order would be:

1. **PiKVM** — buy one, configure stealth USB, understand the API
2. **Zellij** — replace tmux, get comfortable with sessions
3. **Aerospace** — configure tiling, stop using the mouse for window switching
4. **Claude Code** — start using it daily, notice the patterns
5. **Ollama** — local models for low-stakes tasks
6. **mem0** — add shared memory once you have multiple agent sessions
7. **Wispr Flow** — add voice input once the rest is stable
8. **HDMI matrix + NDI** — add when PiKVM video quality becomes the bottleneck

Don't try to build all of it at once. Each layer is useful on its own. The magic comes from the integration, but you earn that incrementally.

---

## What This Actually Feels Like

The honest answer: most days it feels like a regular computer. The difference shows up in the edge cases — when you need to reboot a headless machine at 11pm, when an agent catches a build failure while you're eating dinner, when you OCR a recovery key off a machine you can't physically reach.

The goal was never to be impressive. The goal was to remove friction between intent and execution. That's what all of this is in service of.

---

*Written May 2026. Setup described is a living system — details will drift.*
