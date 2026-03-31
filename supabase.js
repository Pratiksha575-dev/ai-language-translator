import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gaekjcpacopfafzfcowd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhZWtqY3BhY29wZmFmemZjb3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTQ4MTQsImV4cCI6MjA4OTE3MDgxNH0.5rD3XnFmGD_AMyh0_Vfm0z7ZVUJqvuiTc20-4Df8E7g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);