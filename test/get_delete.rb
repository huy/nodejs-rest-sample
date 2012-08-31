#!/usr/bin/env ruby

verbose = ARGV.find {|a| a == '--verbose' or a == '-v' }
method = ARGV.find {|a| a =~ /^--method=\w+/}.to_s.split('=')[1].to_s

all_ids = ARGV.find {|a| a =~ /^--id=\S+/}.to_s.split('=')[1].to_s.split(',')
basename= File.basename(__FILE__)

if all_ids.empty?
 $stderr.puts("Usage examples:")
 $stderr.puts("\t#{basename} --method=GET --id=501c9c5586601f2d09000001")
 $stderr.puts("\t#{basename} --method=DELETE --id=501c9c5586601f2d09000001,502c5855865d037f1a000002 --verbose")
 exit 1
end

$stderr.puts "--method=#{method}" if verbose
$stderr.puts "--id=#{all_ids.inspect}" if verbose

all_ids.each do |id|
  cmd = "curl -X #{method} 'http://nodejs-lawoffice.rhcloud.com/notification/#{id}' | jsonpp"

  $stderr.puts "--cmd=#{cmd}" if verbose

  system(cmd)
end
