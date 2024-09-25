'use client'

import React, { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"

interface Panel {
  Content: string
  Shot: string
  Aim: string
  Prompt: string
  Dialogue: string
  Attribute: string
  Emotion: number
}

interface Page {
  page: number
  num_of_panels: number
  panels: Panel[]
}

interface ChartData {
  name: string
  emotion: number
  content: string
  attribute: string
}

interface CustomTooltipProps {
  active: boolean
  payload: Array<{ value: number, payload: { content: string, attribute: string } }>
  label: string
}

const attributeColors = {
  'ヒキ': '#FF6B6B',
  'メクリ': '#4ECDC4',
  'キメ': '#45B7D1',
  'フリ': '#A9A9A9',
  'ウケ': '#5D5D5D',
  '': '#F0F0F0',
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="font-bold">{label}</p>
        <p>感情: {payload[0].value}</p>
        <p>内容: {payload[0].payload.content}</p>
        <p>属性: {payload[0].payload.attribute || 'なし'}</p>
      </div>
    );
  }
  return null;
};

export function KomaWariConverterComponent() {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<Page[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const { toast } = useToast()

  useEffect(() => {
    try {
      const jsonData: Page[] = JSON.parse(jsonInput)
      setPreview(jsonData)
      setError('')

      const newChartData: ChartData[] = []
      jsonData.forEach((page) => {
        page.panels.forEach((panel, panelIndex) => {
          newChartData.push({
            name: `P${page.page}-${panelIndex + 1}`,
            emotion: panel.Emotion,
            content: panel.Content,
            attribute: panel.Attribute
          })
        })
      })
      setChartData(newChartData)
    } catch {
      if (jsonInput.trim() !== '') {
        setError('無効なJSON入力です。JSONを確認して再試行してください。')
      }
      setPreview([])
      setChartData([])
    }
  }, [jsonInput])

  const handleDifyRequest = async (apiKey: string, inputs: Record<string, unknown>, setOutput: (output: string) => void) => {
    const url = "https://api.dify.ai/v1/completion-messages"
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    }
    const data = {
      inputs,
      "response_mode": "blocking",
      "user": "user-1"
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      })

      const responseData = await response.json()

      if (response.ok) {
        setOutput(responseData.answer)
        toast({
          title: "生成完了",
          description: "Difyからの応答を受信しました。",
        })
      } else {
        throw new Error(`Error ${response.status}: ${responseData.message || response.statusText}`)
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Unknown error occurred'
      toast({
        title: "APIリクエストエラー",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full p-4 space-y-4">
      {/* UI部分はそのまま */}
    </div>
  )
}
