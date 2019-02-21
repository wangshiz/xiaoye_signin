function showIn(){
  console.log(1)
}

function sayhello(name){
  console.log("${name}")
}

module.exports.sayhello = sayhello
exports.showIn = showIn
