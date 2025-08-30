import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnkvwxjkjhaurkcogpjp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua3Z3eGpramhhdXJrY29ncGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NjkxMjAsImV4cCI6MjA3MjE0NTEyMH0.qXmWyEqLT4RS0HiPK7n0CJfPQM1suvWjZt10PhbJtpw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
