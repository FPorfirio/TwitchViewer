$(document).ready(function(){
  
  const ul = document.getElementById("streamList")  
  const streams = ["esl_ruhub_dota2", "faker", "AmazHS", "UCCleague", "Castro_1021", "MOONMOON_OW", "Towelliee", "BASETRADETV", "T90Official", "Shlorox" ]
  const docfrag = document.createDocumentFragment();
  const results = document.getElementById("results")
  const form = document.getElementById("form");
  const btn = document.getElementById("btn");  
  const streamContainer = document.getElementById("streamBox");
  
  form.addEventListener('submit', function(e){
    results.textContent = "";
    e.preventDefault();
    const value = document.getElementById("input").value.toLowerCase()
    $.ajax({
        url: 'https://api.twitch.tv/kraken/search/streams?query='+ value,
        headers: { 'Client-ID':'0z7eravqak6305ek4zcyn1qvy8b1cy'}
      }).then(function(data){
      const streams = data.streams;
      streams.forEach(function(stream) { 
        let name = stream.channel.name;
        let game = stream.channel.game;
        let url = stream.channel.url
        
        if (name == value)  { 
          let stream_tag = document.createElement("a");
          let game_tag = document.createElement("span");
          game_tag.textContent = game;
          stream_tag.href = url;
          stream_tag.target = "_blank";
          stream_tag.textContent = name;
          results.appendChild(stream_tag);
          results.appendChild(game_tag);
          results.style.height = "50px";
          results.style.border = "2px outset black"
        } else {
          results.textContent = "Stream Not found"
        }  
      })
        
      })
  })

  btn.addEventListener("click", function(e){
    console.log("shit");
    if (streamContainer.classList.contains("height")) {
      streamContainer.classList.remove("height");
    } else {
      streamContainer.classList.add("height");
    }
  })
  
  function get_api() { 
    streams.forEach(function(stream) {        
      let li = document.createElement("li");
      li.id = "li" + stream;
      let status;
      $.ajax({
        url: 'https://api.twitch.tv/kraken/channels/'+ stream,
        headers: { 'Client-ID':'0z7eravqak6305ek4zcyn1qvy8b1cy'}
      }).then(getChannel).then(getStream).catch(function(error){
        li.textContent = "Data could not be loaded"
      })
      
      docfrag.appendChild(li)
      
      function getChannel (data) {
        console.log(data)
        let url = data.url
        let img = document.createElement("a")
        let logo = document.createElement("img");         
        let name_tag = document.createElement("a");
        logo.src = data.logo;
        img.href = url;
        img.target = "_blank"
        img.appendChild(logo);
        name_tag.href = url;
        name_tag.target = "_blank"
        name_tag.textContent = data.display_name + " "; 
        li.appendChild(img);
        li.appendChild(name_tag);
        return $.ajax({
          url: 'https://api.twitch.tv/kraken/streams/' + stream,
          headers: { 'Client-ID':'0z7eravqak6305ek4zcyn1qvy8b1cy'},
        })
      }
    
      function getStream (data) {
        let sspan = document.createElement("span")
        if (data.stream == null) {
          status = "offline"
        } else if (data.stream.game.length > 22){
          status = data.stream.game.slice(0, 18) + ".."
        }
        else {
          status = data.stream.game
        }
        sspan.textContent = status;
        li.appendChild(sspan)
      }
      
    })  
    ul.appendChild(docfrag)  
  }  
 get_api()
})