const actionOnCourseWise= document.getElementById("ActionOnCourseWise");
const div1= document.getElementById("div1");
var item1 = document.getElementById("item1");
item1.addEventListener("click", function() {
    // Add your action for item 1 here
    const text = item1.textContent.trim();
    console.log(text.length);
  });
actionOnCourseWise.addEventListener("click",function(){
    div1.innerHTML ="THis is a long long paragraph. kaslaksasalksalskalskalsakslashfsdhfkjfhsdkf"
})

let dropdowns = document.querySelectorAll('.dropdown-toggle')
dropdowns.forEach((dd)=>{
    dd.addEventListener('click', function (e) {
        var el = this.nextElementSibling
        el.style.display = el.style.display==='block'?'none':'block'
    })
})