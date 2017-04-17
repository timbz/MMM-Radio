/*
 MMM-Radio
*/

Module.register("MMM-Radio", {

 requiresVersion: "2.1.0",

  // Default module config.
  defaults: {
    volumeDefault: 0.5,
    volumeStep: 0.1,
    stations: [{
      name: "OFF"
    }, {
      name: "FM4",
      url: "http://mp3stream1.apasf.apa.at:8000/;stream.mp3"
    }, {
      name: "Deutschlandradio Kultur ",
      url: "http://stream.dradio.de/7/536/142684/v1/gnl.akacast.akamaistream.net/dradio_mp3_dkultur_s"
    }]
  },

  // Define required scripts.
  getStyles: function() {
    return ["MMM-Radio.css"];
  },

  // Define start sequence.
  start: function() {
    Log.info("Starting module: " + this.name);

    this.player = new Audio();
    this.player.volume = this.config.volumeDefault;
    this.stationIndex = 0;

    this.updatePlayer();

    var that = this;
    document.onkeypress = function(e) {
      if (e.key == "n") {
        that.next();
      }
    };
  },

  notificationReceived: function(notification, payload, sender) {
    Log.log(this.name + " received a module notification: " + notification);
		if (notification === "RADIO_CHANNEL_NEXT") {
      this.next();
		} else if (notification === "RADIO_VOLUME_UP") {
      this.volumeUp();
    } else if (notification === "RADIO_VOLUME_DOWN") {
      this.volumeDown();
    }
	},

  updatePlayer: function() {
    var station = this.config.stations[this.stationIndex];
    if (station.url) {
      this.player.src = station.url;
      this.player.load();
      this.player.play();
    } else {
      this.player.src = "";
      this.player.load();
      this.player.pause();
    }
  },

  next: function() {
    this.stationIndex++;
    while (this.stationIndex >= this.config.stations.length) {
      this.stationIndex -= this.config.stations.length;
    }
    this.updateDom();
    this.updatePlayer();
  },

  volumeUp: function() {
    var value = this.player.volume + this.config.volumeStep;
    if (value > 1) {
      value = 1
    }
    this.player.volume = value;
    this.alertVolume();
  },

  volumeDown: function() {
    var value = this.player.volume - this.config.volumeStep;
    if (value < 0) {
      value = 0
    }
    this.player.volume = value;
    this.alertVolume();
  },

  alertVolume: function() {
    var icon = "volume-down";
    if (this.player.volume <= 0) {
      icon = "volume-off";
    } else if (this.player.volume >= 1) {
      icon = "volume-up";
    }
    this.sendNotification("SHOW_ALERT", {
      title: "Volume",
      message: value * 100 + "%",
      imageFA: icon,
      timer: 2000
    });
  },

  getDom: function() {
    var table = document.createElement("table");
    table.className = "small";

    for (var i in this.config.stations) {
      var station = this.config.stations[i];

      var row = document.createElement("tr");
      table.appendChild(row);

      var nameCell = document.createElement("td");
      nameCell.innerHTML = station.name;
      row.appendChild(nameCell);

      if (i == this.stationIndex) {
        nameCell.className = "bold"
      }

    }
    return table;
  },

});
