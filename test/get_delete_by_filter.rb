#!/usr/bin/env ruby
require 'uri'
require File.expand_path(File.dirname(__FILE__)) + '/conf'

method = ARGV.find {|a| a =~ /^--method=\w+/}.to_s.split('=')[1].to_s
filter = ARGV.select{|a| a =~ /^--\S+=.+/}.map{|a| a[2..-1].split('=').map{|z| URI.encode(z)}.join('=') }.join('&')

local = ARGV.find {|a| a == '--local' or a == '-l' }
if local
  url = URL[:local]
else
  url = URL[:openshift]
end

verbose = ARGV.find {|a| a == '--verbose' or a == '-v' }

$stderr.puts "--filter=#{filter}" if verbose
$stderr.puts "--method=#{method}" if verbose

basename = File.basename(__FILE__)
if method.empty?
 $stderr.puts("Usage examples:")
 $stderr.puts("\t#{basename} --method=GET --a=100")
 $stderr.puts("\t#{basename} --method=DELETE --a=100 --b='hello mars' --verbose")
 exit 1
end

$stderr.puts "--method=#{method}" if verbose
$stderr.puts "--url=#{url}" if verbose

cmd = "curl -X #{method} '#{url}/notification?#{filter}' | jsonpp"

$stderr.puts "--cmd=#{cmd}" if verbose

system(cmd)

