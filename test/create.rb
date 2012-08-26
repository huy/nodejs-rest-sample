#!/usr/bin/env ruby

verbose = ARGV.find {|a| a == '--verbose' or a == '-v' }

data = ARGV.find {|a| a =~ /^--data=\S+$/}.to_s.split('=')[1]

unless data and File.exists?(data)
  $stderr.puts("Usage examples:")
  $stderr.puts("\t#{File.basename(__FILE__)} --data=new.json")
  exit(1)
end

$stderr.puts("--data=#{data}") if verbose

cmd = "curl -X POST -H 'Content-Type: application/json' -d @#{data} http://nodejs-lawoffice.rhcloud.com/notification | jsonpp"

$stderr.puts("--cmd=#{cmd}") if verbose

system(cmd)
