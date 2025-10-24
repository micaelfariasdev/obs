from flask import Flask, render_template
# Adicione 'os' para carregar a SECRET_KEY de forma mais segura
import os
from flask_socketio import SocketIO, emit

# Recomendado: Defina o SECRET_KEY com uma variável de ambiente (melhor seguranca)
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'seu_segredo_padrao_muito_longo') 
socketio = SocketIO(app)

@app.route('/painel')
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
@socketio.on('lower-third')
def lowerThird(data):
    emit('lower-third', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)