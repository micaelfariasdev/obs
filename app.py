# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'seu_segredo_super_secreto!' # Mude isso
socketio = SocketIO(app)

@app.route('/')
def admin():
    return render_template('admin.html')

@app.route('/overlay')
def overlay():
    return render_template('overlay.html')

@socketio.on('update_time')
def update_time(data):
    emit('data_timed', data, broadcast=True)

@socketio.on('update_scoreboard')
def update_scoreboard(data):
    emit('data_updated', data, broadcast=True)
    
@socketio.on('score_enable')
def score_enable(data):
    emit('score_enable', data, broadcast=True)

@socketio.on('extend_mode')
def extend_mode(data):
    emit('extend_mode', data, broadcast=True)

if __name__ == '__main__':
    print("Servidor iniciado em http://127.0.0.1:5000")
    print("Painel de Controle: http://127.0.0.1:5000")
    print("Overlay (para OBS): http://127.0.0.1:5000/overlay")
    socketio.run(app, host='0.0.0.0', port=5000)