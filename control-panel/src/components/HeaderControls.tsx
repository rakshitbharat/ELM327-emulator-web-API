"use client"

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LED } from "@/components/ui/indicators"
import { PROTOCOLS } from "@/lib/constants"
import { api } from '@/lib/api'

export function HeaderControls() {
  const [protocol, setProtocol] = useState('auto')
  const [ecuAddress, setEcuAddress] = useState('7E0')

  const handleProtocolChange = async (value: string) => {
    try {
      await api.sendCommand({ 
        command: `AT SP ${value}`,
        protocol: value 
      })
      setProtocol(value)
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

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <LED active={protocol !== 'auto'} color="green" />
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
    </div>
  )
}
