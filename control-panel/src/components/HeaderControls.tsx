"use client"

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LED } from "@/components/ui/indicators"
import { PROTOCOLS } from "@/lib/constants"
import { api } from '@/lib/api'
import { cn } from "@/lib/utils"

export function HeaderControls() {
  const [protocol, setProtocol] = useState('auto')
  const [ecuAddress, setEcuAddress] = useState('7E0')
  const [isResetting, setIsResetting] = useState(false)

  const handleProtocolChange = async (value: string) => {
    try {
      await api.sendCommand({ 
        command: `AT SP ${value}`,
        protocol: value 
      })
      setProtocol(value)
      updateEcuAddress(value)
    } catch (error) {
      console.error('Failed to change protocol:', error)
    }
  }

  const handleECUAddressChange = async (value: string) => {
    try {
      await api.sendCommand({ 
        command: `AT SH ${value}`,
        protocol 
      })
      setEcuAddress(value)
    } catch (error) {
      console.error('Failed to set ECU address:', error)
    }
  }

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await api.sendCommand({ command: 'AT Z', protocol });
      setIsResetting(false);
    } catch (error) {
      console.error('Failed to reset system:', error);
      setIsResetting(false);
    }
  };

  const updateEcuAddress = (protocol: string) => {
    const addressMap: { [key: string]: string } = {
      'auto': '7E0',
      '1': '7E1',
      '2': '7E2',
    }
    setEcuAddress(addressMap[protocol] || '7E0')
  }

  useEffect(() => {
    updateEcuAddress(protocol)
  }, [protocol])

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <LED active={protocol !== 'auto'} color={protocol !== 'auto' ? 'green' : 'red'} />
          <Select value={protocol} onValueChange={handleProtocolChange}>
            <SelectTrigger className="w-full sm:w-[280px] bg-black/20 border-zinc-800 text-zinc-100">
              <SelectValue placeholder="Select Protocol" />
            </SelectTrigger>
            <SelectContent>
              {PROTOCOLS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-zinc-300">ECU:</span>
          <Input
            value={ecuAddress}
            onChange={(e) => handleECUAddressChange(e.target.value)}
            className="w-full sm:w-24 font-mono bg-black/20 border-zinc-800 text-zinc-100"
            placeholder="7E0"
          />
        </div>
      </div>

      <button 
        onClick={handleReset} 
        disabled={isResetting}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all",
          "bg-red-900/20 hover:bg-red-900/40 border border-red-900/50",
          "text-red-400 hover:text-red-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "w-full sm:w-auto"
        )}
      >
        {isResetting ? 'Resetting...' : 'Reset System'}
      </button>
    </div>
  )
}
