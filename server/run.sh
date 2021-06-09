kill -9 $(ps aux | grep '[l]istle-server.js' | awk '{print $2}')
cd /Users/juergenriemer/Projects/todo/vuetemplate/server/ 
nodemon listle-server.js
#DEBUG=* nodemon listle-server.js
