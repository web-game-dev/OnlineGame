const shortID = require('shortid');
const Vector2 = require('./Vector2.js')

module.exports = class Player {
  constructor() {
    this.username = '';
    // this.username = name;
    this.id = shortID.generate();
    this.position = new Vector2();
  }
  displayerPlayerInformation() {
    let player = this;
    return '(' + player.username + ':' + player.id + ')';
  }
}
