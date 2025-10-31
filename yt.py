from flask import Flask, request, jsonify
import requests

API_KEY = "SUA_API_KEY"
app = Flask(__name__)

@app.route("/live-viewers")
def live_viewers():
    # vid = request.args.get("videoId")
    vid = '81318774'
    if not vid:
        return jsonify({"error":"videoId faltando"}),400
    url = f"https://kick.com/current-viewers?ids[]={vid}"
    r = requests.get(url).json()
    return jsonify(r)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
