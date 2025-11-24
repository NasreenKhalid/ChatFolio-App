import { createClient } from "../utils/supabase/server";

export default async function Home() {
  // 1. Initialize Supabase Client
  const supabase = await createClient();

  // 2. Fetch messages
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return <div className="p-10 text-red-500">Error connecting to DB: {error.message}</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Chatfolio
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Database Connection Status: <span className="text-green-600 font-bold">Active</span>
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-gray-100">
            Message Test
          </h2>
          
          <div className="space-y-4">
            {messages?.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg text-sm max-w-[80%] ${
                  msg.role === "assistant"
                    ? "bg-blue-100 text-blue-900 self-start"
                    : "bg-gray-100 text-gray-900 ml-auto"
                }`}
              >
                <span className="font-bold text-xs block mb-1 uppercase opacity-50">
                  {msg.role}
                </span>
                {msg.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}