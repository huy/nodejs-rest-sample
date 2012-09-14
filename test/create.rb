#!/usr/bin/env ruby

require File.expand_path(File.dirname(__FILE__)) + '/conf'

local = ARGV.find {|a| a == '--local' or a == '-l' }
if local
  url = URL[:local]
else
  url = URL[:openshift]
end

verbose = ARGV.find {|a| a == '--verbose' or a == '-v' }
jp = ARGV.find {|a| a == '--jsonpp' or a == '-jp' }

data = ARGV.find {|a| a =~ /^--data=\S+$/}.to_s.split('=')[1]

unless data and File.exists?(data)
  $stderr.puts("Usage examples:")
  $stderr.puts("\t#{File.basename(__FILE__)} --data=new.json")
  exit(1)
end

$stderr.puts("--data=#{data}") if verbose

cmd = "curl -X POST -H 'Content-Type: application/json' -d @#{data} #{url}/notification"
cmd << ' | jsonpp' if jp

$stderr.puts("--cmd=#{cmd}") if verbose

system(cmd)
