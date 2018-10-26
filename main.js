const http=require('http'),
fs=require('fs'),
url= require('url'),
{
    parse

}=require('querystring');

mimeTypes={
"html":"text/html",
"jpeg": "image/jpeg",
"jpg": "image/jpeg",
"png": "image/png",
"js": "text/javascript",
"css": "text/css"
};

http.createServer((req,res)=>{
    //Control code.
    var pathname=url.parse(req.url).pathname;
    if(pathname=="/"){
        pathname="../index.html";
    }

    console.log(pathname);
    if(pathname == "../index.html"){
//peticion pagina principal
        fs.readFile(pathname, (err,data)=>{
        if(err){
            console.log(err);
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });       
            return res.end("404 Not Found");    
            }
            res.writeHead(200, {
                'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
            });

            res.write(data.toString());

            return res.end();
        

        });
    }
    if(req.method === 'POST' && pathname == '/cv'){
//peticion dle formulario a traves del metodo post
        collectRequestData(req, (err, result) => { 
            if (err) { 
                res.writeHead(400, { 
                    'content-type': 'text/html' 
                }); 
                return res.end('Bad Request'); 
            } 
        fs.readFile("../templates/plantilla.html", function (err, data) {
            if (err) {
                console.log(err);
                // HTTP Status: 404 : NOT FOUND
                // Content Type: text/plain
                res.writeHead(404, {
                  'Content-Type': 'text/html'
                });
                return res.end("404 Not Found");
            }
        
            res.writeHead(200, {
                'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
            });
            let parsedData = data.toString().replace('${dui}', result.dui) 
                .replace("${lastname}", result.lastname) 
                .replace("${firstname}", result.firstname) 
                .replace("${gender}", result.gender) 
                .replace("${civilStatus}", result.civilStatus) 
                .replace("${birth}", result.birth) 
                .replace("${exp}", result.exp) 
                .replace("${tel}", result.tel) 
                .replace("${std}", result.std); 
        
            res.write(parsedData); 
            return res.end(); 
        });
      }); 
    
    }
    if(pathname.split(".")[1]== "css"){
//peticion de la hoja css
        fs.readFile(".."+pathname, (err, data)=>{

        if (err) {
            console.log(err);
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });       
            return res.end("404 Not Found");     }
    
        res.writeHead(200, {
            'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/css'
        });
    
        // Escribe el contenido de data en el body de la respuesta.
        res.write(data.toString());
    
    
        // Envia la respuesta 
        return res.end();
      });
    }
    
}).listen(8081);

function collectRequestData(request, callback) { 

      const FORM_URLENCODED = 'application/x-www-form-urlencoded'; 
      if (request.headers['content-type'] === FORM_URLENCODED) { 
        let body = ''; 
        // Evento de acumulacion de data. 
        request.on('data', chunk => { 
          body += chunk.toString(); 
        }); 
        // Data completamente recibida 
        request.on('end', () => { 
          callback(null, parse(body)); 
        }); 
      } else { 
        callback({ 
          msg: `The content-type don't is equals to ${FORM_URLENCODED}` 
        }); 
      } 
    
}

