// const restService = "http://localhost:8000/list";
const restService = "https://yuzeub.herokuapp.com/list";
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
    axios.get(restService)
        .then(response => {
            this.musics = response.data
            console.log( this.musics)
        })
  },
  methods: {
    addEndList: function (iId) {
      axios.post(restService+"?id="+iId)
      .then(response => {
          this.musics = response.data
          console.log( this.musics)
      })
    },
    addBeginList: function (iId) {
      axios.post(restService+"?id="+iId+"&next")
      .then(response => {
          this.musics = response.data
          console.log( this.musics)
      })
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
          console.log( this.musics)
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

// $.getJson(restService, function(r) {
//   if(r.error) {
//     console.log("error retreiving data");
//   }
//   console.log(r);
// })

function getInputValue(){
  // Selecting the input element and get its value 
  var urlToAdd = document.getElementById("urlToAdd").value;
  console.log(urlToAdd);
  return urlToAdd;
}

function addToPlaylist(){
  var input = getInputValue();
  // musics.push({ address: input });
  // playlist.data.musics.push({ address: input });
  if (input) {
    // var id = input.split('/');
    var reg = /^https:\/\/youtu\.be\/(.+)/;
    console.log(input.replace(reg, '$1'));
    // console.log(id[1]);
    playlist.addEndList(input.replace(reg, '$1'));
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

function playNext(){
  var input = getInputValue();
  // musics.unshift({ address: input });
  // console.log(musics);
  if (input) {
    // playlist.addBeginList(input);
    // var id = input.split('/');
    var reg = /^https:\/\/youtu\.be\/(.+)/;
    console.log(input.replace(reg, '$1'));
    // console.log(id[1]);
    playlist.addBeginList(input.replace(reg, '$1'));
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