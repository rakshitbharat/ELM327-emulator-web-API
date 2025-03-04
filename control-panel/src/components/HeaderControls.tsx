"use client"

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LED } from "@/components/ui/indicators"
import { PROTOCOLS } from "@/lib/constants"
import { api } from '@/lib/api'

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
    // Update ECU address based on the selected protocol
    const addressMap: { [key: string]: string } = {
      'auto': '7E0',
      '1': '7E1',
      '2': '7E2',
      // Add other protocol-specific addresses here
    }
    setEcuAddress(addressMap[protocol] || '7E0')
  }

  useEffect(() => {
    updateEcuAddress(protocol)
  }, [protocol])

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <LED active={protocol !== 'auto'} color={protocol !== 'auto' ? 'green' : 'red'} />
        <Select value={protocol} onValueChange={handleProtocolChange}>
          <SelectTrigger className="w-[280px]">
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

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">ECU Address:</span>
        <Input
          value={ecuAddress}
          onChange={(e) => handleECUAddressChange(e.target.value)}
          className="w-24 font-mono"
          placeholder="7E0"
        />
      </div>

      <button onClick={handleReset} disabled={isResetting} className="bg-red-500 text-white px-4 py-2 rounded">
       {isResetting ? 'Resetting...' : 'Reset System'}
      </button>
    </div>
  )
}
