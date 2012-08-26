#!/usr/bin/env ruby

filter=ARGV.select{|a| a =~ /^--\S+=.+/}.map{|a| a[2..-1].sub(/=(.+)/,"='\\1'") }.join('&')

verbose =  ARGV.find {|a| a == '--verbose' or a == '-v' }

$stderr.puts "--filter=#{filter}" if verbose

cmd = "curl http://nodejs-lawoffice.rhcloud.com/notification?#{filter} | jsonpp"

$stderr.puts "--cmd=#{cmd}" if verbose

system(cmd)

