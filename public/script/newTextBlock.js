function check() {
    var checkBox1 = document.getElementById("exampleRadios1");
    var checkBox2 = document.getElementById("exampleRadios2");
    var text = document.getElementById("ifCheckedStage");
    var text1 = document.getElementById("ifCheckedStage1");
    var text2 = document.getElementById("ifCheckedStage2");
    if (checkBox2.checked){
        text.style.display = "block";
        text1.style.display = "block";
        text2.style.display = "block";
    }
    else if (checkBox1.checked){
        text.style.display = "none";
        text1.style.display = "none";
        text2.style.display = "none";
    }
}