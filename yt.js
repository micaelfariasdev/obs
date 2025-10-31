async function getViewers() {
  const url = "https://kick.com/current-viewers?ids[]=gabepeixe";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error("Falha ao buscar visualizações:", err);
    return null;
  }
}



const CLIENT_SECRET = "ut6279lelxzmb2co5xfzcn57eoj1nv";

async function getToken() {
    const r = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "client_credentials"
        })
    });
    const j = await r.json();
    console.log(j.access_token);
    return j.access_token;
}

const CLIENT_ID = "2bzjxtqivocapaj24qaizy7zn07jqw";
const TOKEN = "2ybazpa23jdqddbrgmhip6rxabq4ar";
const USER_LOGIN = "gabepeixe";

async function getTwitchViewers() {
  const r = await fetch(`https://api.twitch.tv/helix/streams?user_login=${USER_LOGIN}`, {
    headers: {
      "Client-ID": CLIENT_ID,
      "Authorization": `Bearer ${TOKEN}`
    }
  });
  const j = await r.json();
  if (j.data && j.data.length > 0) {
    console.log(j.data[0].viewer_count);
} else {
    console.log("Offline ou canal não encontrado");
}
console.log(j);
}

getTwitchViewers();
