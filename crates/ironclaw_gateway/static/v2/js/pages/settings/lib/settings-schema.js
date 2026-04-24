export const SETTINGS_TABS = [
  { id: "inference", label: "Inference", icon: "spark" },
  { id: "agent", label: "Agent", icon: "bolt" },
  { id: "channels", label: "Channels", icon: "send" },
  { id: "networking", label: "Networking", icon: "pulse" },
  { id: "tools", label: "Tools", icon: "tool" },
  { id: "skills", label: "Skills", icon: "file" },
  { id: "users", label: "Users", icon: "lock" },
];

export const INFERENCE_FIELDS = [
  {
    group: "Embeddings",
    fields: [
      { key: "embeddings.enabled", label: "Enable embeddings", description: "Semantic search over workspace memory", type: "boolean" },
      { key: "embeddings.provider", label: "Provider", description: "Embedding model provider", type: "select", options: ["openai", "nearai"] },
      { key: "embeddings.model", label: "Model", description: "Embedding model identifier", type: "text" },
    ],
  },
  {
    group: "Sampling",
    fields: [
      { key: "temperature", label: "Temperature", description: "Default sampling temperature (0.0–2.0)", type: "float", min: 0, max: 2, step: 0.1 },
    ],
  },
];

export const AGENT_FIELDS = [
  {
    group: "Core",
    fields: [
      { key: "agent.name", label: "Agent name", description: "Display name for the assistant", type: "text" },
      { key: "agent.max_parallel_jobs", label: "Max parallel jobs", description: "Concurrent background job limit", type: "number" },
      { key: "agent.job_timeout_secs", label: "Job timeout", description: "Seconds before a job is marked stuck", type: "number" },
      { key: "agent.max_tool_iterations", label: "Max tool iterations", description: "Tool call limit per turn", type: "number" },
      { key: "agent.use_planning", label: "Planning", description: "Enable multi-step planning before execution", type: "boolean" },
      { key: "agent.auto_approve_tools", label: "Auto-approve tools", description: "Skip approval for all tool calls", type: "boolean" },
      { key: "agent.default_timezone", label: "Timezone", description: "IANA timezone for scheduled work", type: "text" },
      { key: "agent.session_idle_timeout_secs", label: "Session idle timeout", description: "Seconds of inactivity before session ends", type: "number" },
      { key: "agent.stuck_threshold_secs", label: "Stuck threshold", description: "Seconds before a job is considered stuck", type: "number" },
      { key: "agent.max_repair_attempts", label: "Max repair attempts", description: "Retry limit for stuck job recovery", type: "number" },
      { key: "agent.max_cost_per_day_cents", label: "Daily cost limit (cents)", description: "Maximum spend per day in cents", type: "number", min: 0 },
      { key: "agent.max_actions_per_hour", label: "Actions per hour limit", description: "Hourly action rate cap", type: "number", min: 0 },
      { key: "agent.allow_local_tools", label: "Allow local tools", description: "Enable filesystem and shell access", type: "boolean" },
    ],
  },
  {
    group: "Heartbeat",
    fields: [
      { key: "heartbeat.enabled", label: "Enable heartbeat", description: "Periodic proactive execution", type: "boolean" },
      { key: "heartbeat.interval_secs", label: "Interval", description: "Seconds between heartbeat runs", type: "number" },
      { key: "heartbeat.notify_channel", label: "Notify channel", description: "Channel to send heartbeat notifications", type: "text" },
      { key: "heartbeat.notify_user", label: "Notify user", description: "User ID to notify on findings", type: "text" },
      { key: "heartbeat.quiet_hours_start", label: "Quiet hours start", description: "Hour (0–23) to begin suppression", type: "number", min: 0, max: 23 },
      { key: "heartbeat.quiet_hours_end", label: "Quiet hours end", description: "Hour (0–23) to end suppression", type: "number", min: 0, max: 23 },
      { key: "heartbeat.timezone", label: "Timezone", description: "IANA timezone for quiet hours", type: "text" },
    ],
  },
  {
    group: "Sandbox",
    fields: [
      { key: "sandbox.enabled", label: "Enable sandbox", description: "Docker-based tool execution", type: "boolean" },
      { key: "sandbox.policy", label: "Policy", description: "Container filesystem access level", type: "select", options: ["readonly", "workspace_write", "full_access"] },
      { key: "sandbox.timeout_secs", label: "Timeout", description: "Container execution time limit", type: "number", min: 0 },
      { key: "sandbox.memory_limit_mb", label: "Memory limit (MB)", description: "Container memory ceiling", type: "number", min: 0 },
      { key: "sandbox.image", label: "Docker image", description: "Container image for sandbox runs", type: "text" },
    ],
  },
  {
    group: "Routines",
    fields: [
      { key: "routines.max_concurrent", label: "Max concurrent", description: "Parallel routine execution limit", type: "number", min: 0 },
      { key: "routines.default_cooldown_secs", label: "Default cooldown", description: "Seconds between routine runs", type: "number", min: 0 },
    ],
  },
  {
    group: "Safety",
    fields: [
      { key: "safety.max_output_length", label: "Max output length", description: "Character limit on tool output", type: "number", min: 0 },
      { key: "safety.injection_check_enabled", label: "Injection detection", description: "Scan tool outputs for prompt injection", type: "boolean" },
    ],
  },
  {
    group: "Skills",
    fields: [
      { key: "skills.max_active", label: "Max active skills", description: "Concurrent skill attachment limit", type: "number", min: 0 },
      { key: "skills.max_context_tokens", label: "Max context tokens", description: "Token budget for injected skill prompts", type: "number", min: 0 },
    ],
  },
  {
    group: "Search",
    fields: [
      { key: "search.fusion_strategy", label: "Fusion strategy", description: "Result merging method for hybrid search", type: "select", options: ["rrf", "weighted"] },
    ],
  },
];

export const NETWORKING_FIELDS = [
  {
    group: "Gateway",
    fields: [
      { key: "channels.gateway_host", label: "Host", description: "Gateway bind address", type: "text" },
      { key: "channels.gateway_port", label: "Port", description: "Gateway listen port", type: "number" },
    ],
  },
  {
    group: "Tunnel",
    fields: [
      { key: "tunnel.provider", label: "Provider", description: "Public tunnel service", type: "select", options: ["ngrok", "cloudflare", "tailscale", "custom"] },
      { key: "tunnel.public_url", label: "Public URL", description: "Static tunnel endpoint", type: "text" },
    ],
  },
];

export const RESTART_REQUIRED_KEYS = new Set([
  "embeddings.enabled", "embeddings.provider", "embeddings.model",
  "agent.auto_approve_tools", "tunnel.provider", "tunnel.public_url",
  "gateway.rate_limit", "gateway.max_connections",
]);
