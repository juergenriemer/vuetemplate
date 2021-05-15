killall screen
screen -dmS server bash -c 'echo "doing stuff"; /Users/juergenriemer/Projects/todo/vuetemplate/server/run.sh; exec bash'
