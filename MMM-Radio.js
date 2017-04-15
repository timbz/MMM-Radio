/* global Module */

/* Magic Mirror
 * Module: WeatherForecast
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("internetradio", {

  // Default module config.
  defaults: {
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
    return ["internetradio.css"];
  },

  // Define required translations.
  getTranslations: function() {
    // TODO
    return false;
  },

  // Define start sequence.
  start: function() {
    Log.info("Starting module: " + this.name);

    this.player = new Audio();
    this.stationIndex = 0;

    this.play();

    var that = this;
    document.onkeypress = function(e) {
      if (e.key == "n") {
        that.next();
      }
    };
  },

  play: function() {
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
    this.play();
  },

  // Override dom generator.
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
