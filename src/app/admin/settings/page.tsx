"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Lock, 
  Mail, 
  Moon, 
  Sun, 
  Save, 
  CheckCircle2, 
  Database, 
  Cpu, 
  Smartphone,
  Info,
  ChevronRight,
  UserPlus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import AdminLayout from "@/components/admin/admin-layout"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings Saved",
        description: "Your system configuration has been updated successfully.",
      })
    }, 1500)
  }

  const SETTINGS_SECTIONS = [
    { id: "general", label: "General", icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "security", label: "Security", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "text-amber-600", bg: "bg-amber-50" },
    { id: "appearance", label: "Appearance", icon: Palette, color: "text-purple-600", bg: "bg-purple-50" },
  ]

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-slate-500 font-bold mt-1 text-lg">Configure global platform parameters and preferences.</p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 group"
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                Saving Changes...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="mr-3 h-6 w-6 transition-transform group-hover:rotate-12" />
                Save All Changes
              </div>
            )}
          </Button>
        </section>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="h-20 bg-white border-2 border-slate-50 p-2 rounded-[2rem] shadow-sm mb-10 w-full md:w-auto overflow-x-auto overflow-y-hidden">
            {SETTINGS_SECTIONS.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="h-full px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <section.icon className="mr-3 h-5 w-5" />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 gap-10">
            <TabsContent value="general" className="mt-0 space-y-10">
              <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
                <CardHeader className="p-0 mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-inner">
                      <Globe className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">Platform Identity</CardTitle>
                      <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Basic information about your CBT system.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Application Name</Label>
                      <Input 
                        defaultValue="Nigeria CBT & CBQ Excellence Platform" 
                        className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold px-6 focus:bg-white transition-all text-lg"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Support Email</Label>
                      <Input 
                        defaultValue="support@cbt-nigeria.edu" 
                        className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 font-bold px-6 focus:bg-white transition-all text-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">App Description</Label>
                    <Textarea 
                      defaultValue="Advanced Computer-Based Testing and Quiz platform for educational excellence in Nigeria." 
                      className="min-h-[120px] rounded-[2rem] border-2 border-slate-100 bg-slate-50 font-bold p-8 focus:bg-white transition-all text-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
                <CardHeader className="p-0 mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 shadow-inner">
                      <Database className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">Infrastructure</CardTitle>
                      <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Backend services and storage management.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  {[
                    { label: "Firebase Persistence", desc: "Enable offline data caching for student devices", icon: Smartphone },
                    { label: "Automatic Backups", desc: "Weekly cloud backup of student results and question bank", icon: Lock },
                    { label: "Performance Monitoring", desc: "Track system response times and API latency", icon: Cpu },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/50 border-2 border-slate-50 shadow-sm">
                      <div className="flex items-center space-x-5">
                        <div className="bg-white p-3 rounded-xl shadow-sm">
                          <item.icon className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg leading-tight">{item.label}</div>
                          <div className="text-slate-400 font-bold text-sm mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-10">
              <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
                <CardHeader className="p-0 mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-50 p-4 rounded-2xl text-red-600 shadow-inner">
                      <Shield className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">Security & Integrity</CardTitle>
                      <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Anti-cheat mechanisms and user access controls.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  {[
                    { label: "Tab Switching Detection", desc: "Warn and auto-submit if student leaves the exam tab", checked: true },
                    { label: "Multiple Device Login", desc: "Allow students to log in from more than one device simultaneously", checked: false },
                    { label: "Force Logout Inactivity", desc: "Automatically logout users after 30 minutes of inactivity", checked: true },
                    { label: "Question Randomization", desc: "Shuffle questions and options for every student attempt", checked: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/50 border-2 border-slate-50 shadow-sm">
                      <div className="flex items-center space-x-5">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-red-500">
                          <Lock className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg leading-tight">{item.label}</div>
                          <div className="text-slate-400 font-bold text-sm mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                      <Switch defaultChecked={item.checked} className="data-[state=checked]:bg-red-500" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-10">
              <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
                <CardHeader className="p-0 mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-amber-50 p-4 rounded-2xl text-amber-600 shadow-inner">
                      <Bell className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">Notification Alerts</CardTitle>
                      <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Manage how users receive platform updates.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  {[
                    { label: "New Competition Email", desc: "Notify all students when a new national challenge is created", checked: true },
                    { label: "Weekly Progress Report", desc: "Send automated performance summaries to students every Sunday", checked: true },
                    { label: "System Maintenance Alerts", desc: "Notify administrators about upcoming system updates", checked: true },
                    { label: "Result Sync Confirmation", desc: "Push notification when offline results are successfully synced", checked: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/50 border-2 border-slate-50 shadow-sm">
                      <div className="flex items-center space-x-5">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-amber-500">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg leading-tight">{item.label}</div>
                          <div className="text-slate-400 font-bold text-sm mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                      <Switch defaultChecked={item.checked} className="data-[state=checked]:bg-amber-500" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 space-y-10">
              <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] p-10">
                <CardHeader className="p-0 mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 shadow-inner">
                      <Palette className="h-8 w-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">Theme & UI Customization</CardTitle>
                      <CardDescription className="text-slate-500 font-bold mt-1 text-lg">Control the visual identity of the platform.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[2rem] bg-slate-50/50 border-4 border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-primary transition-all shadow-sm hover:shadow-xl">
                      <div className="flex items-center space-x-5">
                        <div className="bg-white p-4 rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Sun className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-xl leading-tight">Light Mode</div>
                          <div className="text-slate-400 font-bold text-sm mt-1">Default clean interface</div>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full border-4 border-primary bg-primary shadow-lg shadow-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-slate-50/50 border-4 border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-900 hover:border-slate-700 transition-all shadow-sm hover:shadow-xl">
                      <div className="flex items-center space-x-5">
                        <div className="bg-white p-4 rounded-2xl shadow-sm text-slate-900 group-hover:bg-slate-800 group-hover:text-white transition-all">
                          <Moon className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 group-hover:text-white text-xl leading-tight transition-colors">Dark Mode</div>
                          <div className="text-slate-400 font-bold text-sm mt-1 group-hover:text-slate-500 transition-colors">Night-friendly experience</div>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full border-4 border-slate-200" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Primary Brand Color</Label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { name: "Deep Blue", hex: "#1E3A8A", active: true },
                        { name: "Emerald", hex: "#10B981", active: false },
                        { name: "Vibrant Indigo", hex: "#6366F1", active: false },
                        { name: "Classic Slate", hex: "#475569", active: false },
                      ].map((color) => (
                        <div 
                          key={color.name}
                          className={cn(
                            "flex items-center space-x-3 px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md active:scale-95",
                            color.active ? "border-primary bg-primary/5" : "border-slate-100 bg-white hover:border-slate-200"
                          )}
                        >
                          <div className="h-6 w-6 rounded-lg shadow-sm" style={{ backgroundColor: color.hex }} />
                          <span className={cn("font-black text-sm", color.active ? "text-primary" : "text-slate-600")}>{color.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Info Card */}
        <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
              <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                <Info className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">Need Advanced Help?</h3>
                <p className="text-slate-400 font-bold text-lg mt-1">Check out our developer documentation or contact the enterprise support team.</p>
              </div>
            </div>
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-white/20 bg-white/10 hover:bg-white/20 text-white font-black text-lg transition-all group">
              Contact Support
              <ChevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
