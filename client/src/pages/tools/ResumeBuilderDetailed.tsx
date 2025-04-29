import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    title: string;
    summary: string;
    website: string;
    linkedin: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}

const ResumeBuilderDetailed = () => {
  const [activeTab, setActiveTab] = useState("editor");
  const [activeSection, setActiveSection] = useState("personal-info");
  const [templateStyle, setTemplateStyle] = useState("modern");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeGenerated, setResumeGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      title: "",
      summary: "",
      website: "",
      linkedin: "",
    },
    education: [],
    experience: [],
    skills: []
  });
  
  const { toast } = useToast();

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience]
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "Intermediate"
    };
    
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill]
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    });
  };

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id)
    });
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    });
  };

  const generateResume = () => {
    // Validation
    if (!resumeData.personalInfo.fullName) {
      toast({
        title: "Missing information",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate resume generation process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setResumeGenerated(true);
          
          toast({
            title: "Resume generated",
            description: "Your resume has been created successfully!",
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const downloadResume = (format: 'pdf' | 'docx') => {
    toast({
      title: `Resume Downloaded`,
      description: `Your resume has been downloaded in ${format.toUpperCase()} format.`,
    });
  };

  const clearForm = () => {
    setResumeData({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        title: "",
        summary: "",
        website: "",
        linkedin: "",
      },
      education: [],
      experience: [],
      skills: []
    });
    
    setResumeGenerated(false);
    
    toast({
      title: "Form cleared",
      description: "All resume information has been cleared.",
    });
  };

  const toolInterface = (
    <div className="space-y-6">
      <Tabs 
        defaultValue="editor" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Resume Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="tips">Resume Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-4">Resume Sections</h3>
                  <div className="space-y-2">
                    <Button 
                      variant={activeSection === "personal-info" ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => setActiveSection("personal-info")}
                    >
                      Personal Information
                    </Button>
                    <Button 
                      variant={activeSection === "experience" ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => setActiveSection("experience")}
                    >
                      Work Experience ({resumeData.experience.length})
                    </Button>
                    <Button 
                      variant={activeSection === "education" ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => setActiveSection("education")}
                    >
                      Education ({resumeData.education.length})
                    </Button>
                    <Button 
                      variant={activeSection === "skills" ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => setActiveSection("skills")}
                    >
                      Skills ({resumeData.skills.length})
                    </Button>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium text-lg">Template Options</h3>
                    <div className="space-y-2">
                      <Label htmlFor="template-style">Template Style</Label>
                      <Select
                        value={templateStyle}
                        onValueChange={setTemplateStyle}
                      >
                        <SelectTrigger id="template-style">
                          <SelectValue placeholder="Select template style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <Button 
                        onClick={generateResume}
                        disabled={isGenerating}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isGenerating ? "Generating..." : resumeGenerated ? "Update Resume" : "Generate Resume"}
                      </Button>
                      
                      <Button
                        onClick={clearForm}
                        variant="outline"
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    {isGenerating && (
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-gray-500 text-center">
                          {progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-8">
              {activeSection === "personal-info" && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name*</Label>
                        <Input 
                          id="full-name" 
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input 
                          id="title"
                          value={resumeData.personalInfo.title}
                          onChange={(e) => updatePersonalInfo('title', e.target.value)}
                          placeholder="Software Engineer"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          placeholder="johndoe@example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input 
                          id="website"
                          value={resumeData.personalInfo.website}
                          onChange={(e) => updatePersonalInfo('website', e.target.value)}
                          placeholder="www.johndoe.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                        <Input 
                          id="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address (Optional)</Label>
                        <Input 
                          id="address"
                          value={resumeData.personalInfo.address}
                          onChange={(e) => updatePersonalInfo('address', e.target.value)}
                          placeholder="123 Main St"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">City (Optional)</Label>
                        <Input 
                          id="city"
                          value={resumeData.personalInfo.city}
                          onChange={(e) => updatePersonalInfo('city', e.target.value)}
                          placeholder="San Francisco"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State (Optional)</Label>
                        <Input 
                          id="state"
                          value={resumeData.personalInfo.state}
                          onChange={(e) => updatePersonalInfo('state', e.target.value)}
                          placeholder="CA"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zip-code">Zip Code (Optional)</Label>
                        <Input 
                          id="zip-code"
                          value={resumeData.personalInfo.zipCode}
                          onChange={(e) => updatePersonalInfo('zipCode', e.target.value)}
                          placeholder="94105"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country (Optional)</Label>
                        <Input 
                          id="country"
                          value={resumeData.personalInfo.country}
                          onChange={(e) => updatePersonalInfo('country', e.target.value)}
                          placeholder="United States"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Textarea 
                          id="summary"
                          value={resumeData.personalInfo.summary}
                          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                          placeholder="Experienced software engineer with a passion for creating efficient and scalable applications..."
                          className="h-24"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {activeSection === "experience" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">Work Experience</h3>
                      <Button
                        size="sm"
                        onClick={addExperience}
                      >
                        Add Experience
                      </Button>
                    </div>
                    
                    {resumeData.experience.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <p>No work experience added yet.</p>
                        <p className="text-sm mt-1">Click "Add Experience" to include your work history.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {resumeData.experience.map((exp, index) => (
                          <div key={exp.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Experience {index + 1}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExperience(exp.id)}
                                className="text-red-500 h-8 px-2"
                              >
                                Remove
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`company-${exp.id}`}>Company</Label>
                                <Input 
                                  id={`company-${exp.id}`}
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                  placeholder="Company Name"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`position-${exp.id}`}>Position</Label>
                                <Input 
                                  id={`position-${exp.id}`}
                                  value={exp.position}
                                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                  placeholder="Job Title"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`location-${exp.id}`}>Location (Optional)</Label>
                                <Input 
                                  id={`location-${exp.id}`}
                                  value={exp.location}
                                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                  placeholder="City, State"
                                />
                              </div>
                              
                              <div className="flex items-center space-x-2 mt-6">
                                <Checkbox 
                                  id={`current-${exp.id}`}
                                  checked={exp.current}
                                  onCheckedChange={(checked) => 
                                    updateExperience(exp.id, 'current', checked === true)
                                  }
                                />
                                <Label htmlFor={`current-${exp.id}`} className="text-sm">
                                  I currently work here
                                </Label>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`start-date-${exp.id}`}>Start Date</Label>
                                <Input 
                                  id={`start-date-${exp.id}`}
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                  placeholder="MM/YYYY"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`end-date-${exp.id}`}>End Date</Label>
                                <Input 
                                  id={`end-date-${exp.id}`}
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                  placeholder="MM/YYYY"
                                  disabled={exp.current}
                                />
                              </div>
                              
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`description-${exp.id}`}>Description</Label>
                                <Textarea 
                                  id={`description-${exp.id}`}
                                  value={exp.description}
                                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                  placeholder="Describe your responsibilities and achievements..."
                                  className="h-24"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeSection === "education" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">Education</h3>
                      <Button
                        size="sm"
                        onClick={addEducation}
                      >
                        Add Education
                      </Button>
                    </div>
                    
                    {resumeData.education.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <p>No education added yet.</p>
                        <p className="text-sm mt-1">Click "Add Education" to include your educational background.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {resumeData.education.map((edu, index) => (
                          <div key={edu.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Education {index + 1}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEducation(edu.id)}
                                className="text-red-500 h-8 px-2"
                              >
                                Remove
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`school-${edu.id}`}>School/University</Label>
                                <Input 
                                  id={`school-${edu.id}`}
                                  value={edu.school}
                                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                  placeholder="University Name"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                                <Input 
                                  id={`degree-${edu.id}`}
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                  placeholder="Bachelor of Science"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                                <Input 
                                  id={`field-${edu.id}`}
                                  value={edu.fieldOfStudy}
                                  onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                                  placeholder="Computer Science"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`edu-start-date-${edu.id}`}>Start Date</Label>
                                <Input 
                                  id={`edu-start-date-${edu.id}`}
                                  type="month"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                  placeholder="MM/YYYY"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`edu-end-date-${edu.id}`}>End Date (or Expected)</Label>
                                <Input 
                                  id={`edu-end-date-${edu.id}`}
                                  type="month"
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                  placeholder="MM/YYYY"
                                />
                              </div>
                              
                              <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`edu-description-${edu.id}`}>Description (Optional)</Label>
                                <Textarea 
                                  id={`edu-description-${edu.id}`}
                                  value={edu.description}
                                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                  placeholder="Additional information like GPA, honors, relevant coursework..."
                                  className="h-24"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {activeSection === "skills" && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">Skills</h3>
                      <Button
                        size="sm"
                        onClick={addSkill}
                      >
                        Add Skill
                      </Button>
                    </div>
                    
                    {resumeData.skills.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <p>No skills added yet.</p>
                        <p className="text-sm mt-1">Click "Add Skill" to include your professional skills.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.skills.map((skill) => (
                          <div key={skill.id} className="flex items-center space-x-3">
                            <div className="flex-grow">
                              <Input 
                                value={skill.name}
                                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                placeholder="Skill name (e.g. JavaScript, Project Management)"
                              />
                            </div>
                            
                            <div className="w-48">
                              <Select
                                value={skill.level}
                                onValueChange={(value) => updateSkill(skill.id, 'level', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Skill level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Beginner">Beginner</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                                  <SelectItem value="Advanced">Advanced</SelectItem>
                                  <SelectItem value="Expert">Expert</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(skill.id)}
                              className="text-red-500 h-8"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {resumeGenerated && (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Your Resume</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadResume('pdf')}
                    >
                      Download PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadResume('docx')}
                    >
                      Download DOCX
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md bg-gray-50 p-8 min-h-[600px] flex flex-col items-center justify-center">
                  <div className="w-full max-w-2xl bg-white shadow-md p-8 rounded-sm">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold">{resumeData.personalInfo.fullName || "Your Name"}</h2>
                      <p className="text-gray-600">{resumeData.personalInfo.title || "Professional Title"}</p>
                      
                      <div className="flex justify-center space-x-4 mt-2 text-sm text-gray-500">
                        {resumeData.personalInfo.email && (
                          <span>{resumeData.personalInfo.email}</span>
                        )}
                        {resumeData.personalInfo.phone && (
                          <span>{resumeData.personalInfo.phone}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-center space-x-4 mt-1 text-sm text-gray-500">
                        {resumeData.personalInfo.city && resumeData.personalInfo.state && (
                          <span>{resumeData.personalInfo.city}, {resumeData.personalInfo.state}</span>
                        )}
                        {resumeData.personalInfo.linkedin && (
                          <span>{resumeData.personalInfo.linkedin}</span>
                        )}
                      </div>
                    </div>
                    
                    {resumeData.personalInfo.summary && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold border-b pb-1 mb-2">Summary</h3>
                        <p className="text-sm text-gray-700">{resumeData.personalInfo.summary}</p>
                      </div>
                    )}
                    
                    {resumeData.experience.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h3>
                        <div className="space-y-4">
                          {resumeData.experience.map((exp) => (
                            <div key={exp.id}>
                              <div className="flex justify-between">
                                <h4 className="font-medium">{exp.position}</h4>
                                <span className="text-sm text-gray-500">
                                  {exp.startDate && exp.startDate.substring(0, 7).replace('-', '/')} - {exp.current ? 'Present' : (exp.endDate && exp.endDate.substring(0, 7).replace('-', '/'))}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>{exp.company}</span>
                                <span>{exp.location}</span>
                              </div>
                              <p className="text-sm mt-1 text-gray-700">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {resumeData.education.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold border-b pb-1 mb-2">Education</h3>
                        <div className="space-y-4">
                          {resumeData.education.map((edu) => (
                            <div key={edu.id}>
                              <div className="flex justify-between">
                                <h4 className="font-medium">{edu.school}</h4>
                                <span className="text-sm text-gray-500">
                                  {edu.startDate && edu.startDate.substring(0, 7).replace('-', '/')} - {edu.endDate && edu.endDate.substring(0, 7).replace('-', '/')}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                              </div>
                              {edu.description && (
                                <p className="text-sm mt-1 text-gray-700">{edu.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {resumeData.skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill) => (
                            <Badge key={skill.id} variant="outline" className="px-2 py-1">
                              {skill.name} {skill.level !== "Intermediate" && `(${skill.level})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Resume Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${templateStyle === 'modern' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplateStyle('modern')}>
                  <div className="aspect-[8.5/11] bg-white border shadow-sm mb-2 p-4">
                    <div className="w-full h-6 bg-blue-500 mb-3"></div>
                    <div className="w-1/2 h-4 bg-gray-300 mx-auto mb-4"></div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-3/4 h-2 bg-gray-200"></div>
                    </div>
                    <div className="w-1/3 h-3 bg-blue-300 mb-2"></div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                    </div>
                    <div className="w-1/3 h-3 bg-blue-300 mb-2"></div>
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                    </div>
                  </div>
                  <h4 className="font-medium text-center">Modern</h4>
                </div>
                
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${templateStyle === 'professional' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplateStyle('professional')}>
                  <div className="aspect-[8.5/11] bg-white border shadow-sm mb-2 p-4">
                    <div className="w-full flex justify-between mb-4">
                      <div className="w-1/2 h-6 bg-gray-800"></div>
                      <div className="w-1/3 h-6 bg-gray-300"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-3/4 h-2 bg-gray-200"></div>
                    </div>
                    <div className="w-1/3 h-3 bg-gray-800 mb-2"></div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                    </div>
                    <div className="w-1/3 h-3 bg-gray-800 mb-2"></div>
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                    </div>
                  </div>
                  <h4 className="font-medium text-center">Professional</h4>
                </div>
                
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${templateStyle === 'creative' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplateStyle('creative')}>
                  <div className="aspect-[8.5/11] bg-white border shadow-sm mb-2 p-4">
                    <div className="flex mb-4">
                      <div className="w-1/3 bg-purple-200 p-4 mr-2">
                        <div className="w-full h-4 bg-purple-400 mb-2"></div>
                        <div className="w-full h-2 bg-gray-300 mb-1"></div>
                        <div className="w-full h-2 bg-gray-300 mb-1"></div>
                        <div className="w-full h-2 bg-gray-300"></div>
                      </div>
                      <div className="flex-1">
                        <div className="w-2/3 h-6 bg-gray-400 mb-2"></div>
                        <div className="w-1/2 h-3 bg-gray-300 mb-3"></div>
                        <div className="space-y-1">
                          <div className="w-full h-2 bg-gray-200"></div>
                          <div className="w-full h-2 bg-gray-200"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-1/3 h-3 bg-purple-400 mb-1"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                    </div>
                  </div>
                  <h4 className="font-medium text-center">Creative</h4>
                </div>
                
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${templateStyle === 'minimalist' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplateStyle('minimalist')}>
                  <div className="aspect-[8.5/11] bg-white border shadow-sm mb-2 p-4">
                    <div className="w-2/3 h-6 bg-gray-900 mx-auto mb-4"></div>
                    <div className="w-1/2 h-3 bg-gray-400 mx-auto mb-6"></div>
                    <div className="w-1/4 h-3 bg-gray-800 mb-2"></div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                    </div>
                    <div className="w-1/4 h-3 bg-gray-800 mb-2"></div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                    </div>
                    <div className="w-1/4 h-3 bg-gray-800 mb-2"></div>
                    <div className="flex flex-wrap gap-2">
                      <div className="w-1/5 h-3 bg-gray-200"></div>
                      <div className="w-1/4 h-3 bg-gray-200"></div>
                      <div className="w-1/6 h-3 bg-gray-200"></div>
                    </div>
                  </div>
                  <h4 className="font-medium text-center">Minimalist</h4>
                </div>
                
                <div className={`border rounded-md p-4 cursor-pointer hover:border-primary ${templateStyle === 'executive' ? 'border-primary bg-blue-50' : ''}`} onClick={() => setTemplateStyle('executive')}>
                  <div className="aspect-[8.5/11] bg-white border shadow-sm mb-2 p-4">
                    <div className="border-b-2 border-black pb-2 mb-4">
                      <div className="w-3/4 h-6 bg-gray-800 mb-1"></div>
                      <div className="w-1/2 h-3 bg-gray-400"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-3/4 h-2 bg-gray-200"></div>
                    </div>
                    <div className="w-1/3 h-3 bg-gray-800 border-b border-gray-400 mb-2 pb-1"></div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                    </div>
                    <div className="w-1/3 h-3 bg-gray-800 border-b border-gray-400 mb-2 pb-1"></div>
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                    </div>
                  </div>
                  <h4 className="font-medium text-center">Executive</h4>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Resume Writing Tips</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-base">1. Tailor Your Resume to the Job</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Customize your resume for each position by highlighting relevant skills and experience that match the job description. Use keywords from the job posting to help your resume pass through Applicant Tracking Systems (ATS).
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">2. Use Action Verbs</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Begin bullet points with strong action verbs like "achieved," "implemented," "managed," or "developed" to emphasize your accomplishments rather than just listing responsibilities.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">3. Quantify Achievements</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Include specific numbers, percentages, and metrics whenever possible to demonstrate the impact of your work. For example, "Increased sales by 20%" or "Managed a team of 15 people."
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">4. Keep It Concise</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Aim for a one-page resume if you have less than 10 years of experience. Use bullet points, concise language, and focus on the most relevant information to keep your resume reader-friendly.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">5. Proofread Carefully</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Typos and grammatical errors can significantly hurt your chances. Proofread multiple times and ask someone else to review your resume before submitting it.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">6. Include Relevant Skills</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Feature both hard skills (technical abilities) and soft skills (interpersonal traits) that are relevant to the position. Prioritize skills mentioned in the job description.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">7. Use a Clean, Professional Design</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Choose a clean, professional layout with consistent formatting. Use standard fonts like Arial or Calibri, and include sufficient white space to make your resume easy to read.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Common Resume Mistakes to Avoid</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-base">1. Including an Objective Statement</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Objective statements are outdated. Instead, use a professional summary that highlights your experience and value.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">2. Using a Generic Resume</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Sending the same resume to every job application significantly reduces your chances. Customize each resume for the specific position.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">3. Including Irrelevant Information</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Remove information that doesn't support your candidacy for the specific role, including irrelevant jobs, outdated skills, or unrelated hobbies.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">4. Focusing on Duties Instead of Achievements</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Don't just list your job responsibilities. Emphasize what you accomplished in each role and how you added value to the organization.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-base">5. Using Unprofessional Contact Information</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Make sure your email address is professional (ideally FirstName.LastName@domain.com). Avoid nicknames or humorous email addresses on your resume.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-lg mb-4">Related Design Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Logo Maker</h4>
              <p className="text-sm text-gray-600 mb-3">
                Create professional, custom logos in minutes with our intuitive AI-powered logo design tool.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Design a Logo
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Business Card Maker</h4>
              <p className="text-sm text-gray-600 mb-3">
                Design professional business cards that leave a lasting impression on your contacts.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Create Business Cards
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Cover Letter Generator</h4>
              <p className="text-sm text-gray-600 mb-3">
                Create customized cover letters to complement your resume and improve job application success.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Write a Cover Letter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const introduction = "Create a professional, customized resume in minutes with our intuitive builder and ATS-friendly templates.";
  
  const description = `
    Our Resume Builder is a comprehensive tool designed to help job seekers create polished, professional resumes that stand out to employers and pass through Applicant Tracking Systems (ATS). This powerful yet user-friendly resume creation platform combines intuitive design features with expert-backed templates to help you craft an impressive resume regardless of your industry, experience level, or design skills.
    
    The builder offers a step-by-step approach to resume creation, guiding you through each section with helpful tips and examples tailored to various professions. You can easily input your personal information, work experience, education, skills, and other relevant details through our clean, organized interface. As you build your resume, you'll receive real-time feedback and suggestions to improve content quality and optimize for ATS systems that many employers use to screen applicants.
    
    Choose from multiple professionally designed templates, each carefully crafted to meet industry standards while offering distinct visual styles ranging from conservative and traditional to modern and creative. All templates are fully customizable, allowing you to adjust colors, fonts, spacing, and section layouts to match your personal preferences or industry expectations. The built-in preview function lets you see exactly how your resume will appear to employers as you make changes.
    
    Once complete, your resume can be downloaded in multiple formats including PDF and Word document, ensuring compatibility with various application systems. The tool also includes helpful resume writing tips, examples of effective bullet points for different roles, and guidance on resume best practices to maximize your chances of landing interviews. Whether you're creating your first resume, updating an existing one, or completely rebranding yourself for a career change, our Resume Builder provides everything you need to create a professional, effective document that showcases your qualifications.
  `;

  const howToUse = [
    "Select a professional template that matches your industry and career goals from our library of ATS-friendly designs.",
    "Fill in your personal information including your name, contact details, and professional summary to create the header of your resume.",
    "Add your work experience by entering details about previous positions, responsibilities, and accomplishments, using strong action verbs and quantifiable achievements.",
    "Include your educational background with information about degrees, certifications, relevant coursework, and academic achievements.",
    "List your relevant skills, categorizing them appropriately (technical skills, soft skills, languages, etc.) and indicating proficiency levels.",
    "Preview your resume in real-time to see how it looks and make adjustments to formatting, content, or layout as needed.",
    "Download your finished resume in your preferred format (PDF or DOCX) to use in job applications.",
    "Return to the builder anytime to update your information or create targeted versions for different job applications."
  ];

  const features = [
    "✅ Professional ATS-friendly templates designed by career experts for higher success rates with application systems",
    "✅ Intuitive step-by-step builder with section-specific guidance and content suggestions for each part of your resume",
    "✅ Real-time preview that shows exactly how your resume will appear to employers as you make edits",
    "✅ Multiple export options including PDF and DOCX formats compatible with all job application systems",
    "✅ Expert resume writing tips and examples tailored to different industries and experience levels",
    "✅ Ability to create and save multiple resume versions for different job applications or career paths",
    "✅ Keyword optimization assistance to help your resume pass through Applicant Tracking Systems (ATS)"
  ];

  const faqs = [
    {
      question: "What is an ATS-friendly resume and why is it important?",
      answer: "An ATS-friendly resume is designed to successfully pass through Applicant Tracking Systems (ATS), which are software programs used by employers to screen and rank job applications based on keywords, skills, and other criteria before they reach human recruiters. These systems help employers manage high volumes of applications efficiently, but they can filter out qualified candidates if their resumes aren't properly formatted or don't include relevant keywords. Our resume templates are specifically designed to be ATS-friendly by using standard section headings, appropriate formatting (avoiding tables, headers/footers, and graphics that can confuse ATS), and clean layouts that are easily parsed. Using an ATS-friendly resume is crucial because up to 75% of resumes are rejected by these systems before a human ever sees them. By creating a resume optimized for both ATS screening and human readability, you significantly increase your chances of getting past the initial screening and landing an interview."
    },
    {
      question: "How should I structure my work experience section for maximum impact?",
      answer: "For maximum impact, structure your work experience section using these best practices: List positions in reverse chronological order (most recent first) with clear job titles, company names, locations, and employment dates. Begin each bullet point with strong action verbs (like 'managed,' 'developed,' 'implemented') to emphasize your proactive contributions. Focus on achievements rather than just responsibilities—quantify results whenever possible (e.g., 'Increased sales by 20%' rather than 'Responsible for sales'). Include 3-5 bullet points per position, prioritizing accomplishments most relevant to your target role. Tailor descriptions to highlight experience that aligns with the job you're applying for, incorporating keywords from the job description. For older or less relevant positions, include fewer details or group similar roles together if space is limited. If you have employment gaps, consider using years instead of months for dates, or address significant gaps in your cover letter. When describing current positions, use present tense; for previous positions, use past tense. Focus on transferable skills and accomplishments if changing careers or industries. Remember, quality is more important than quantity—a targeted, achievement-focused experience section is more effective than an exhaustive list of every duty you've performed."
    },
    {
      question: "Should I include a photo on my resume?",
      answer: "In most cases, you should not include a photo on your resume, particularly when applying for jobs in the United States, Canada, the UK, and Australia. Here's why: Anti-discrimination considerations: Including a photo can potentially trigger unconscious bias related to age, race, gender, or appearance. Many employers prefer resumes without photos to maintain compliance with equal employment opportunity regulations. Professional focus: Your qualifications, skills, and experience should be the focus of your resume, not your appearance. Applicant Tracking Systems (ATS): Photos can confuse ATS software, potentially causing your resume to be filtered out before reaching human reviewers. Space optimization: Resume space is valuable and limited; using it for a photo takes away from content that demonstrates your qualifications. However, there are some exceptions to this guideline: Country-specific practices: In some countries like France, Germany, and parts of Asia, photos on resumes may be customary or expected. Check local practices when applying internationally. Industry-specific exceptions: In certain fields like acting, modeling, or some public-facing roles, a professional headshot might be appropriate or requested. If you're unsure whether to include a photo, err on the side of caution and omit it. Instead, maintain a professional profile photo on your LinkedIn account, which you can reference on your resume, giving employers the option to view your photo in a professional networking context."
    }
  ];

  return (
    <ToolPageTemplate
      toolSlug="resume-builder"
      toolContent={
        <ToolContentTemplate
          introduction={introduction}
          description={description}
          howToUse={howToUse}
          features={features}
          faqs={faqs}
          toolInterface={toolInterface}
        />
      }
    />
  );
};

export default ResumeBuilderDetailed;