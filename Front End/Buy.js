window.onscroll = function() {navlucent();}



function navlucent() {
if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("navlucent").className = "navbar fixed-top shadow  navbar-expand-xl my-nav";
  } else{
document.getElementById("navlucent").className = "navbar fixed-top shadow navbar-expand-xl new-nav";
  }

}
