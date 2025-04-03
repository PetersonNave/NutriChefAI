export async function GET(req) {
    const apiKey = "0786d3fa529bef1ff2f5cc75877a40a16581d8965d748a7f716ea82beadb42a2";
    
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "Apple"; 
  
    const url = `https://serpapi.com/search.json?api_key=${apiKey}&q=${encodeURIComponent(query)}&engine=google_images&ijn=0`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: "Erro na requisição" }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  }
  