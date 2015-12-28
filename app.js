(function(){
  var input = document.getElementById("console").innerHTML;
  document.getElementById("input").innerHTML = input;
  try{
    input = input.replace(/console\.log/,"log")
    var ret = eval(input)
    output.innerHTML = output.innerHTML + "<br>>" +ret;
  } catch (e) {
    output.innerHTML += e; 
  }
  function log( input ){
    output.innerHTML = output.innerHTML + "<br><-"+input;
  }
})()