chrome.runtime.onInstalled.addListener(function() {
	var context = "image";
    var title = "Upload to Conneksus Stream";
    var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});  

    var xhr = new XMLHttpRequest();
    var url = "http://conneksus.appspot.com/stream";
    xhr.open("GET",url,true);
    xhr.send();
    var myArr;
	xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4 && xhr.status == 200) {
        	myArr = JSON.parse(xhr.responseText);
   			for(i = 0; i < myArr.length; i++) {   		   			
				var temp = chrome.contextMenus.create({"title": myArr[i].id, "contexts":[context],"parentId":id,"id": myArr[i].id + ";" + "context" + context + i});     		
    		}    
    	}
	}
});

// add click event
chrome.contextMenus.onClicked.addListener(onClickHandler);    

// The onClicked callback function.
function onClickHandler(info, tab) {	
	var imgUrl = info.srcUrl;
    var xhr = new XMLHttpRequest();
    xhr.open("GET",imgUrl,true);
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function(e) {
    	//if (xhr.readyState == 4 && xhr.status == 200) {
    	if(this.status == 200){
    		var img_blob = new Blob([this.response], {type: 'image/png'});
			var xhr_post = new XMLHttpRequest();
			xhr_post.open("POST","http://conneksus.appspot.com/external_insert",true);
			var stream_id_page = info.menuItemId;
			var form = new FormData();
			form.append("img_blob",img_blob);
			form.append("stream_id",stream_id_page.split(";")[0]);
			//xhr_post.send("stream_id=" + stream_id_page + "&img_blob=" + img_blob);
			xhr_post.send(form);
			xhr_post.onload = function(e){
				if(this.status == 200){
					alert("Successfully uploaded to " + stream_id_page.split(";")[0] + "!");
				}
				else
					alert("Could not upload to " + stream_id_page.split(";")[0] + "!");
			}        	
    	}
	}
};

