window.onload=loadpage();

function loadpage()
{
  var pageurl=window.location.href;

  if(pageurl.toLowerCase().indexOf("producttype")>0)
  {
    if(pageurl.toLowerCase().indexOf("acceptjs")>0)
    {
        document.getElementById("acceptjs").style.display="block";
        document.getElementById("rdCard").click();
            }
    else if(pageurl.toLowerCase().indexOf("acceptui")>0)
    {
      AcceptUI();
    }
    else if(pageurl.toLowerCase().indexOf("accepthosted")>0)
    {
      /* if(pageurl.toLowerCase().indexOf("customerid")>0)
       {
         var id = getParameterByName('customerid',window.location.href);
         
       }
       validateID(id);
         AcceptHosted();*/
    }
    else if(pageurl.toLowerCase().indexOf("acceptcustomer")>0)
    {
      //AcceptCustomer();
    }
  }
}

function AcceptUI()
{
     document.getElementById("acceptui").style.display="block";
    
     var ele=document.getElementById("btnAcceptUI");
     ele.click();
     
      setTimeout(function(){ 
             var d = document.getElementById("AcceptUIContainer");
              d.className += "show";
       },200);
     
}

function showData(option)
    {
     if(option=="card")
     {
        document.getElementById("bank").style.display="none";
        document.getElementById("card").style.display = "block";
    }
    else{
     document.getElementById("card").style.display = "none";
     document.getElementById("bank").style.display = "block";
 }
 document.getElementById("btns").style.display = "block";
}

function sendPaymentDataToAnet(){
    var authData = {};
    authData.clientKey = "58Ur68c2tnE452gbmhWX4AT5Lpc9wQGCG5CcR39nZRU6NJmh2W7BzvqSRz3rJV5k";//"8s2F95Q7brhHd7Tns";
    authData.apiLoginID = "244dkNUJcH";//"78BZ5Xprry";

    var sel=document.querySelector('input[name="optradio"]:checked').value;
    
    if(sel=="card")
    {
        var cardData={};
        cardData.cardNumber = document.getElementById("cardNumber").value;
        cardData.month = document.getElementById("expMonth").value;
        cardData.year = document.getElementById("expYear").value;
        cardData.cardCode = document.getElementById("cardCode").value;
      /*  paymentData.zip = "73301";
        paymentData.fullName = "Lakshmi";*/
    }
    else
    {
       var bankData={};
       bankData.accountNumber = document.getElementById('accountNumber').value;
       bankData.routingNumber = document.getElementById('routingNumber').value;
       bankData.nameOnAccount = document.getElementById('nameOnAccount').value;
       bankData.accountType = document.getElementById('accountType').value;
   }
   var secureData = {};
   secureData.authData = authData;
   if(sel=="card")
    secureData.cardData = cardData;
   else
   secureData.bankData = bankData;

   Accept.dispatchData(secureData, responseHandler);
}

function responseHandler(response) {
    if (response.messages.resultCode === "Error") {
        var i = 0;
        while (i < response.messages.message.length) {
            console.log(
                response.messages.message[i].code + ": " +
                response.messages.message[i].text
                );
            i = i + 1;
        }
    } else {
        paymentFormUpdate(response.opaqueData);
    }
}
function paymentFormUpdate(opaqueData) {
    document.getElementById("dataDescriptor").value = opaqueData.dataDescriptor;
    document.getElementById("dataValue").value = opaqueData.dataValue;

    // If using your own form to collect the sensitive data from the customer,
    // blank out the fields before submitting them to your server.
    document.getElementById("cardNumber").value = "";
    document.getElementById("expMonth").value = "";
    document.getElementById("expYear").value = "";
    document.getElementById("cardCode").value = "";
    document.getElementById("accountNumber").value = "";
    document.getElementById("routingNumber").value = "";
    document.getElementById("nameOnAccount").value = "";
    document.getElementById("accountType").value = "";

var tokenVal=$("#dataValue").val();
   // Ajax call for API
   $.ajax({
    type: 'GET',  
    url:'https://10.173.198.59:5006/api/AcceptSuite/AcceptJS',
    data: {
      token: tokenVal
    },
    contentType: "application/json; charset=utf-8",
    success: function (data, textStatus, jqXHR) {
            $("#msg").text(data);
            $(".alert").css("display","block");
        },
        error: function (jqXHR, textStatus, errorThrown) {
          alert(textStatus);
        }
  });
}