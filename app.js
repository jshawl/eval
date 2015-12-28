(function(){
  var cm = CodeMirror(document.getElementById("input"),{
    value: document.getElementById("console").innerHTML,
    mode: 'javascript',
    lineNumbers: true
  })
  function evaluate(input){
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
  }

  var run = document.querySelector(".js-run")
  run.addEventListener("click", function(e){
    e.preventDefault(); 
    evaluate(cm.getValue())
  })
})()