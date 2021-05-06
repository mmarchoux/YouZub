// const restService = "http://localhost:8000/list";
const restUrl = "http://rushmore.freeboxos.fr";
const restPort = 8000;
const restService = restUrl + ":" + restPort + "/list";
const restSearchService = restUrl + ":" + restPort + "/search";
// const header = 'Access-Control-Allow-Origin: *';

var playlist = new Vue({
  el: '#playlist',
  data: {
    musics: [
      // { address: 'Foo' },
      // { address: 'Bar' }
    ]
  },
  mounted() {
    // axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
    // axios.get(restService, { headers: header })
    // axios.get(restService, { crossdomain: true  })
    refresh()
  },
  methods: {
    addEndList: function (input) {
      if (document.getElementById("toggle-state").checked) {
        axios.post(restSearchService+"?query="+input)
        .then(response => {
            this.musics = response.data
            console.log(this.musics)
        })
      } else {
        axios.post(restService+"?id="+input)
        .then(response => {
            this.musics = response.data
            console.log(this.musics)
        })
      }
    },
    addBeginList: function (input) {
      if (document.getElementById("toggle-state").checked) {
        axios.post(restSearchService+"?query="+input+"&next")
        .then(response => {
            this.musics = response.data
            console.log(this.musics)
        })
      } else {
        axios.post(restService+"?id="+input+"&next")
        .then(response => {
            this.musics = response.data
            console.log(this.musics)
        })
      }
    },
    // remove: function (event) {
      // console.log(this.id);
      // axios.delete(restService+"?id="+iId)
      // .then(response => {
      //     this.musics = response.data
      //     console.log( this.musics)
      // })
    // },
    remove: function (iId) {
      axios.delete(restService+"?id="+iId)
      .then(response => {
          this.musics = response.data
          console.log(this.musics)
      })
    }
    // addEndList: function (iUrl) {
    //   this.musics.push({address: iUrl});
    // },
    // addBeginList: function (iUrl) {
    //   this.musics.unshift({address: iUrl});
    // },
    // remove: function (iUrl) {
    //   this.musics.splice(this.musics.indexOf(iUrl), 1);
    // }
  }
});

function refresh() {
  axios.get(restService)
  .then(response => {
      playlist.musics = response.data
      console.log( playlist.musics)
  })
}

function setInputText() {
  var input = document.getElementById("inputValue");
  if (document.getElementById("toggle-state").checked) { // Checked -> Search, Untoggled -> URL
    input.placeholder = "Search a music...";
    input.setAttribute("aria-label", "Search a music");
    input.setAttribute("aria-describedby", "search");
  }
  else {
    input.placeholder = "Paste a sharing URL...";
    input.setAttribute("aria-label", "Paste a sharing URL");
    input.setAttribute("aria-describedby", "url");
  }
}

// $.getJson(restService, function(r) {
//   if(r.error) {
//     console.log("error retreiving data");
//   }
//   console.log(r);
// })
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Enter key adds video to queue
document.getElementById("inputValue").addEventListener("keyup", event => {
  if(event.key !== "Enter") return;
  document.getElementById("addEnd").click(); 
  event.preventDefault(); // No need to `return false;`.
});

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: playlist.musics[0].id,
    playerVars: {autoplay: true},
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var started = false;
function onPlayerStateChange(event) {
  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //   setTimeout(stopVideo, 6000);
  //   done = true;
  // }
  if (event.data == YT.PlayerState.PLAYING && !started) {
    started = true;
  }
  if (event.data == YT.PlayerState.ENDED && started && playlist.musics.length > 1) {//player.getPlayerSate() == 0 ) {
    // player.videoId = playlist.musics[0].id;
    playNextVideo();
    // event.target.playVideo();
  }
}

function playNextVideo() {
  refresh();
  player.loadVideoById(playlist.musics[1].id);
  player.nextVideo();
  playlist.remove(playlist.musics[0].id);
}

function getInputValue() {
  // Selecting the input element and get its value 
  var inputValue = document.getElementById("inputValue").value;
  document.getElementById("inputValue").value = "";
  console.log(inputValue);
  return inputValue;
}

function addToPlaylist() {
  var input = getInputValue();
  // musics.push({ address: input });
  // playlist.data.musics.push({ address: input });
  if (input) {
    if (document.getElementById("toggle-state").checked) {
      playlist.addEndList(input.replace(" ", "%20"));
    } else {
      // var id = input.split('/');
      var reg = /^https:\/\/youtu\.be\/(.+)/;
      console.log(input.replace(reg, '$1'));
      // console.log(id[1]);
      playlist.addEndList(input.replace(reg, '$1'));
    }
  }
  else {
    $('#addEnd').popover('enable');
    $('#addEnd').popover('show');
    // $('#addEnd').popover('destroy', {delay: {hide: 1000}});
    $("#addEnd").on('shown.bs.popover',function() { 
       setTimeout(function() {
        $("#addEnd").popover("hide")}, 500);
    });
    $('#addEnd').popover('disable');
    // $("#addEnd").popover({ trigger:"manual" }).click(function() { 
    //   var pop = $(this); 
    //   pop.popover("show") 
    //   pop.on('shown.bs.popover',function() { 
    //    setTimeout(function() {
    //     pop.popover("hide")}, 1000); 
    //   }) 
    // });
    console.log("empty");
  }
  // console.log(musics);
}

function putNext(){
  var input = getInputValue();
  // musics.unshift({ address: input });
  // console.log(musics);
  if (input) {
    if (document.getElementById("toggle-state").checked) {
      playlist.addBeginList(input.replace(" ", "%20"));
    } else {
      // playlist.addBeginList(input);
      // var id = input.split('/');
      var reg = /^https:\/\/youtu\.be\/(.+)/;
      console.log(input.replace(reg, '$1'));
      // console.log(id[1]);
      playlist.addBeginList(input.replace(reg, '$1'));
    }
  }
  else {
    $('#addFirst').popover('enable');
    $('#addFirst').popover('show');
    $("#addFirst").on('shown.bs.popover',function() { 
       setTimeout(function() {
        $("#addFirst").popover("hide")}, 500);
    });
    $('#addFirst').popover('disable');
    // $('#addEnd').popover('show');
    // $("#addFirst").popover({ trigger:"manual" }).click(function() { 
    //   var pop = $(this); 
    //   pop.popover("show") 
    //   pop.on('shown.bs.popover',function() { 
    //    setTimeout(function() {
    //     pop.popover("hide")}, 1000); 
    //   }) 
    // })
    console.log("empty");
  }
}

function remove(musicToRemove){
//   // var input = getInputValue();
//   // musics.unshift({ address: input });
  console.log("removing " + musicToRemove);
  playlist.remove(musicToRemove);
}
