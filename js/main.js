/*global $, console*/

$(document).ready(function () {
    
    "use strict";
    
    var contents,
        url,
        nm,
        em,
        sb,
        ms,
        dt,
        errors,
        collect,
        i;
    
    contents = {};
    dt = {};
    errors = [];
    
    $(".container").load("./partials/home.html", function (rsp) {
        contents["./partials/home.html"] = rsp;
    });
    
    
    function handleResponse(rsp) {
        $(".feedback").html(rsp).val();
        $("input:text").val();
    }
        
    function handleErrors(jqXHR, textStatus, errorThrown) {
        console.log("textStatus: " + textStatus + "\n" + "errorThrown: " + errorThrown);
    }
    
    function validateForm(ev) {
        ev.preventDefault();
        nm = $("#first-name").val();
        em = $("#email").val();
        sb = $("#subject").val();
        ms = $("#comments").val();
        nm.trim();
        em.trim();
        sb.trim();
        ms.trim();
        
        if (nm === "") {
            errors.push("Please fill out name.");
        } else {
            dt.name = nm;
        }
        
        if (em === "") {
            errors.push("Please fill out email.");
        } else {
            dt.email = em;
        }

        if (sb === "") {
            errors.push("Please fill out subject.");
        } else {
            dt.subject = sb;
        }
        
        if (ms === "") {
            errors.push("Please fill out comments.");
        } else {
            dt.comments = ms;
        }
        
        if (errors.length === 0) {
            $.ajax({
                type: "post",
                url: "./server-side-script/web-service.php",
                data: dt,
                dataType: "text"
            }).done(handleResponse).fail(handleErrors);
        } else {
            collect = "Please fix the following errors:" + "<ul>";
            for (i = 0; i < errors.length; i += 1) {
                collect += "<li>" + errors[i] + "</li>";
            }
            collect += "</ul>";
            $(".feedback").html(collect);
            errors = [];
            collect = [];
        }
    }
    
    function storeContents(container) {
        
        if (contents[container]) {
            $(".container").html(contents[container]);
            console.log("Loaded from array");
        } else {
            $(".container").load(container, function (pageRsp) {
                contents[url] = pageRsp;
                console.log("Loaded by ajax request");
            });
        }
    }

    $(".box a").on("click", function (ev) {
        ev.preventDefault();
        url = $(this).attr("href");
        storeContents(url);
        $(".container").on("submit", "form", validateForm);
    });
});