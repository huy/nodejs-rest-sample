#!/usr/bin/env ruby

require File.expand_path(File.dirname(__FILE__)) + '/conf'

local = ARGV.find {|a| a == '--local' or a == '-l' }
if local
  url = URL[:local]
else
  url = URL[:openshift]
end

verbose = ARGV.find {|a| a == '--verbose' or a == '-v' }

data = ARGV.find {|a| a =~ /^--data=\S+$/}.to_s.split('=')[1]
id = ARGV.find {|a| a =~ /^--id=\w+/}.to_s.split('=')[1]

unless id and data and File.exists?(data)
  $stderr.puts("Usage examples:")
  $stderr.puts("\t#{File.basename(__FILE__)} --id=501c9c5586601f2d09000001 --data=update.json")
  exit(1)
end

$stderr.puts("--id=#{id}") if verbose
$stderr.puts("--data=#{data}") if verbose

cmd= "curl -X PUT -H 'Content-Type: application/json' -d @#{data} '#{url}/notification/#{id}' | jsonpp"

$stderr.puts(cmd) if verbose

system(cmd)
