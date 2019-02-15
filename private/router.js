var url_string = window.location.href
var url = new URL(url_string)
var params = url.searchParams
if(params.get('reset')!=null){
    document.cookie = 'id='
    window.location = url_string.split('?')[0]
}else if(params.get('id')!=null){
    document.cookie = params.get("id")
    window.location = url_string.split('?')[0]
}