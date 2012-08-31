#!/usr/bin/env ruby
require 'uri'

filter=ARGV.select{|a| a =~ /^--\S+=.+/}.map{|a| a[2..-1].split('=').map{|z| URI.encode(z)}.join('=') }.join('&')

verbose =  ARGV.find {|a| a == '--verbose' or a == '-v' }

$stderr.puts "--filter=#{filter}" if verbose

cmd = "curl 'http://nodejs-lawoffice.rhcloud.com/notification?#{filter}' | jsonpp"

$stderr.puts "--cmd=#{cmd}" if verbose

system(cmd)

