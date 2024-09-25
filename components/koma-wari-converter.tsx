'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Settings, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  const [width, setWidth] = useState(960)
  const [height, setHeight] = useState(1280)
  const [storyAdaptationApiKey, setStoryAdaptationApiKey] = useState('')
  const [punchlineCreationApiKey, setPunchlineCreationApiKey] = useState('')
  const [comicStripApiKey, setComicStripApiKey] = useState('')
  const { toast } = useToast()

  // Story Adaptation state
  const [original, setOriginal] = useState('')
  const [theme, setTheme] = useState('')
  const [world, setWorld] = useState('')
  const [instruction, setInstruction] = useState('')
  const [storyAdaptationOutput, setStoryAdaptationOutput] = useState('')

  // Punchline Creation state
  const [character, setCharacter] = useState('')
  const [setup, setSetup] = useState('')
  const [reaction, setReaction] = useState('')
  const [direction, setDirection] = useState('')
  const [numOfResults, setNumOfResults] = useState(1)
  const [punchlineCreationOutput, setPunchlineCreationOutput] = useState('')

  // Comic Strip Creation state
  const [scenario, setScenario] = useState('')
  const [comicStripOutput, setComicStripOutput] = useState('')

  // API Error state
  const [apiError, setApiError] = useState<string | null>(null)

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

  const handleDifyRequest = async (apiKey: string, inputs: Record<string, any>, setOutput: (output: string) => void) => {
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
        setApiError(null)
        toast({
          title: "生成完了",
          description: "Difyからの応答を受信しました。",
        })
      } else {
        throw new Error(`Error ${response.status}: ${responseData.message || response.statusText}`)
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred'
      setApiError(errorMessage);
      toast({
        title: "APIリクエストエラー",
        description: errorMessage,
        variant: "destructive",  // これでエラーは解消されます
      });
    }
  }

  const handleStoryAdaptation = () => {
    handleDifyRequest(storyAdaptationApiKey, { original, theme, world, instruction }, setStoryAdaptationOutput)
  }

  const handlePunchlineCreation = () => {
    handleDifyRequest(punchlineCreationApiKey, { character, setup, reaction, direction, num_of_results: numOfResults }, setPunchlineCreationOutput)
  }

  const handleComicStripCreation = () => {
    handleDifyRequest(comicStripApiKey, { scenario }, setComicStripOutput)
  }

  const pasteToConverter = (output: string) => {
    setJsonInput(output)
  }

  return (
    <div className="w-full p-4 space-y-4">
      {/* UI部分はそのまま */}
    </div>
  )
}
