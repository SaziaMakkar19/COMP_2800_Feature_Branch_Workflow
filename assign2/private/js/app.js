$(document).ready(function () {


  function getUsers() {
    $.ajax({
      url: "/get-users",
      dataType: "json",
      type: "GET",
      success: function (data) {
        console.log(data);
        let str = `<tr>
  <th class="tableHeader">ID</th>
  <th class="tableHeader">First Name</th>
  <th class="tableHeader">Last Name</th>
  <th class="tableHeader">Email</th>
  <th class="tableHeader">Group Name</th>
  <th class="tableHeader">Phone Number</th>
  </tr>`;
        for (let i = 0; i < data.rows.length; i++) {
          let row = data.rows[i];
          //console.log("row", row);
          str += ("<tr><td class='id'>" + row.ID +
            "</td><td class='fname'>" + row.fname +
            "</td><td class='lname'>" + row.lname +
            "</td><td class='email'>" + row.email +
            "</td><td class='groupName'>" + row.groupName +
            "</td><td class='email'>" + row.tel +
            "</td><td><button class='deleteRow'>close</button></td></tr>");
        }
        //console.log(str);
        $("#users").html(str);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#errorLog").text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      }
    });
  }
  getUsers();

  $('#submit').click(function (e) {
    e.preventDefault();

    let formData = {
      fname: $("#fname").val(),
      lname: $("#lname").val(),
      email: $("#email").val(),
      groupName: $("#groupName").val(),
      tel: $("#tel").val()
    };


    $("#fname").val("");
    $("#lname").val("");
    $("#email").val("");
    $("#groupName").val("");
    $("#tel").val("");

    $.ajax({
      url: "/add-users",
      dataType: "json",
      type: "POST",
      data: formData,
      success: function (data) {
        //console.log(data);
        alert("Database Updated");
        getUsers();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#errorLog").text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      }
    });
  });


  // $('#deleteAll').click(function (e) {
  //   e.preventDefault();

  //   $.ajax({
  //     url: "/delete-all-users",
  //     dataType: "json",
  //     type: "POST",
  //     success: function (data) {
  //       console.log(data);
  //       $("#status").html("All records deleted.");
  //       getUsers();
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       $("#errorLog").text(jqXHR.statusText);
  //       console.log("ERROR:", jqXHR, textStatus, errorThrown);
  //     }

  //   });
  // });

  $('#users').on('click', 'span', function () {

    let dataClass = $(this).parent().attr('class');

    let spanText = $(this).text();
    let td = $(this).parent();
    let input = $("<input type='text' value='" + spanText + "'>");
    td.html(input);
    
    $(input).keyup(function(e) {
      let val = null;
      let span = null;
      if (e.which == 13) {
        val = $(input).val();
        span = $("<span>" + val + "</span>");
        td.html(span);
        // console.log(td.parent().find("[class='id']")[0]);
        
        let dataToSend = {
          id: td.parent().find("[class='id']").html()
        };
        dataToSend[dataClass] = val;

        $.ajax({
          url: "/update-user",
          dataType: "json",
          type: "POST",
          data: dataToSend,
          success: function(data) {
              //console.log(data);
              
              getUsers();
          },
          error: function(jqXHR, textStatus, errorThrown) {
              $("#errorLog").text(jqXHR.statusText);
              console.log("ERROR:", jqXHR, textStatus, errorThrown);
          }

      });
      }
    })

  });

  $('#users').on('click', 'button', function () {

     var answer = confirm("Are you sure you want to delete this user?");
     if(answer == true) {
      console.log("Deleting the row.");
      let td = $(this).parent();
      let dataToSend = {
        id: td.parent().find("[class='id']").html()
      };

      $.ajax({
        url: "/delete-user",
        dataType: "json",
        type: "POST",
        data: dataToSend,
        success: function(data) {
            getUsers();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#errorLog").text(jqXHR.statusText);
            console.log("ERROR:", jqXHR, textStatus, errorThrown);
        }

    });
     }
      
  });

});