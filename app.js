window.onload=loadpage();

function loadpage()
{
  var pageurl=window.location.href;

  if(pageurl.toLowerCase().indexOf("producttype")>0)
  {
    if(pageurl.toLowerCase().indexOf("acceptjs")>0)
    {
        document.getElementById("acceptjs").style.display="block";
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
    var paymentData={};
    if(sel=="card")
    {
        paymentData.cardNumber = document.getElementById("cardNumber").value;
        paymentData.month = document.getElementById("expMonth").value;
        paymentData.year = document.getElementById("expYear").value;
        //paymentData.cardCode = document.getElementById("cardCode").value;
      /*  paymentData.zip = "73301";
        paymentData.fullName = "Lakshmi";*/
    }
    else
    {

       paymentData.accountNumber = document.getElementById('accountNumber').value;
       paymentData.routingNumber = document.getElementById('routingNumber').value;
       paymentData.nameOnAccount = document.getElementById('nameOnAccount').value;
       paymentData.accountType = document.getElementById('accountType').value;
   }
   


   var secureData = {};
   secureData.authData = authData;
   secureData.paymentData = paymentData;

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
    alert(document.getElementById("dataValue").value);
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

   // document.getElementById("paymentForm").submit();
   //TODO Ajax call for API
}

