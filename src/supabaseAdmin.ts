import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

export default supabaseAdmin;
