function check() {
    var checkBox1 = document.getElementById("exampleRadios1");
    var checkBox2 = document.getElementById("exampleRadios2");
    var text = document.getElementById("ifCheckedStage");
    if (checkBox2.checked){
      text.style.display = "block";
    } 
    else if (checkBox1.checked){
       text.style.display = "none";
    }
  }