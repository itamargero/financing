"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Upload, FileText, CheckCircle } from "lucide-react"

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  middleName?: string
  dateOfBirth: string
  gender: string
  civilStatus: string
  nationality: string
  email: string
  mobileNumber: string
  alternateNumber?: string

  // Address Information
  currentAddress: string
  permanentAddress: string
  city: string
  province: string
  zipCode: string
  yearsAtCurrentAddress: string

  // Business Information
  businessName: string
  businessType: string
  businessAddress: string
  businessCity: string
  businessProvince: string
  businessZipCode: string
  yearsInBusiness: string
  numberOfEmployees: string
  businessDescription: string

  // Financial Information
  monthlyIncome: string
  monthlyExpenses: string
  otherIncome?: string
  bankName: string
  accountNumber: string
  accountType: string

  // Loan Information
  loanAmount: string
  loanPurpose: string
  loanTerm: string
  preferredPaymentDate: string

  // References
  reference1Name: string
  reference1Relationship: string
  reference1Contact: string
  reference2Name: string
  reference2Relationship: string
  reference2Contact: string

  // Agreements
  termsAccepted: boolean
  privacyAccepted: boolean
  creditCheckConsent: boolean
}

const steps = [
  { id: 1, title: "Personal Information", description: "Basic personal details" },
  { id: 2, title: "Address Information", description: "Current and permanent address" },
  { id: 3, title: "Business Information", description: "Business details and background" },
  { id: 4, title: "Financial Information", description: "Income and banking details" },
  { id: 5, title: "Loan Details", description: "Loan requirements and purpose" },
  { id: 6, title: "References", description: "Personal and business references" },
  { id: 7, title: "Documents", description: "Upload required documents" },
  { id: 8, title: "Review & Submit", description: "Review and submit application" },
]

export function LoanApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>()

  const progress = (currentStep / steps.length) * 100

  const nextStep = async () => {
    const isValid = await trigger()
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
    console.log("Uploaded files:", uploadedFiles)
    // Handle form submission
  }

  const handleFileUpload = (category: string, files: FileList | null) => {
    if (files) {
      setUploadedFiles((prev) => ({
        ...prev,
        [category]: Array.from(files),
      }))
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register("firstName", { required: "First name is required" })}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register("lastName", { required: "Last name is required" })}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" {...register("middleName")} />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth", { required: "Date of birth is required" })}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Gender *</Label>
                <RadioGroup onValueChange={(value) => setValue("gender", value)} className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="civilStatus">Civil Status *</Label>
                <Select onValueChange={(value) => setValue("civilStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select civil status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  {...register("nationality", { required: "Nationality is required" })}
                  className={errors.nationality ? "border-red-500" : ""}
                />
                {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input
                  id="mobileNumber"
                  {...register("mobileNumber", { required: "Mobile number is required" })}
                  className={errors.mobileNumber ? "border-red-500" : ""}
                />
                {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>}
              </div>
              <div>
                <Label htmlFor="alternateNumber">Alternate Number</Label>
                <Input id="alternateNumber" {...register("alternateNumber")} />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentAddress">Current Address *</Label>
              <Textarea
                id="currentAddress"
                {...register("currentAddress", { required: "Current address is required" })}
                className={errors.currentAddress ? "border-red-500" : ""}
              />
              {errors.currentAddress && <p className="text-red-500 text-sm mt-1">{errors.currentAddress.message}</p>}
            </div>

            <div>
              <Label htmlFor="permanentAddress">Permanent Address *</Label>
              <Textarea
                id="permanentAddress"
                {...register("permanentAddress", { required: "Permanent address is required" })}
                className={errors.permanentAddress ? "border-red-500" : ""}
              />
              {errors.permanentAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.permanentAddress.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...register("city", { required: "City is required" })}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="province">Province *</Label>
                <Input
                  id="province"
                  {...register("province", { required: "Province is required" })}
                  className={errors.province ? "border-red-500" : ""}
                />
                {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>}
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode", { required: "ZIP code is required" })}
                  className={errors.zipCode ? "border-red-500" : ""}
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="yearsAtCurrentAddress">Years at Current Address *</Label>
              <Select onValueChange={(value) => setValue("yearsAtCurrentAddress", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="more-than-5">More than 5 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                {...register("businessName", { required: "Business name is required" })}
                className={errors.businessName ? "border-red-500" : ""}
              />
              {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>}
            </div>

            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <Select onValueChange={(value) => setValue("businessType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="cooperative">Cooperative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessAddress">Business Address *</Label>
              <Textarea
                id="businessAddress"
                {...register("businessAddress", { required: "Business address is required" })}
                className={errors.businessAddress ? "border-red-500" : ""}
              />
              {errors.businessAddress && <p className="text-red-500 text-sm mt-1">{errors.businessAddress.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="businessCity">City *</Label>
                <Input
                  id="businessCity"
                  {...register("businessCity", { required: "Business city is required" })}
                  className={errors.businessCity ? "border-red-500" : ""}
                />
                {errors.businessCity && <p className="text-red-500 text-sm mt-1">{errors.businessCity.message}</p>}
              </div>
              <div>
                <Label htmlFor="businessProvince">Province *</Label>
                <Input
                  id="businessProvince"
                  {...register("businessProvince", { required: "Business province is required" })}
                  className={errors.businessProvince ? "border-red-500" : ""}
                />
                {errors.businessProvince && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessProvince.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="businessZipCode">ZIP Code *</Label>
                <Input
                  id="businessZipCode"
                  {...register("businessZipCode", { required: "Business ZIP code is required" })}
                  className={errors.businessZipCode ? "border-red-500" : ""}
                />
                {errors.businessZipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessZipCode.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                <Select onValueChange={(value) => setValue("yearsInBusiness", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="more-than-5">More than 5 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                <Select onValueChange={(value) => setValue("numberOfEmployees", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 employees</SelectItem>
                    <SelectItem value="6-10">6-10 employees</SelectItem>
                    <SelectItem value="11-25">11-25 employees</SelectItem>
                    <SelectItem value="26-50">26-50 employees</SelectItem>
                    <SelectItem value="more-than-50">More than 50 employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="businessDescription">Business Description *</Label>
              <Textarea
                id="businessDescription"
                placeholder="Describe your business activities, products, or services"
                {...register("businessDescription", { required: "Business description is required" })}
                className={errors.businessDescription ? "border-red-500" : ""}
              />
              {errors.businessDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.businessDescription.message}</p>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (₱) *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  {...register("monthlyIncome", { required: "Monthly income is required" })}
                  className={errors.monthlyIncome ? "border-red-500" : ""}
                />
                {errors.monthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome.message}</p>}
              </div>
              <div>
                <Label htmlFor="monthlyExpenses">Monthly Expenses (₱) *</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  {...register("monthlyExpenses", { required: "Monthly expenses is required" })}
                  className={errors.monthlyExpenses ? "border-red-500" : ""}
                />
                {errors.monthlyExpenses && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyExpenses.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="otherIncome">Other Sources of Income (₱)</Label>
              <Input
                id="otherIncome"
                type="number"
                placeholder="Additional income from other sources"
                {...register("otherIncome")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">Primary Bank *</Label>
                <Select onValueChange={(value) => setValue("bankName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bdo">BDO Unibank</SelectItem>
                    <SelectItem value="bpi">Bank of the Philippine Islands</SelectItem>
                    <SelectItem value="metrobank">Metrobank</SelectItem>
                    <SelectItem value="landbank">Land Bank of the Philippines</SelectItem>
                    <SelectItem value="pnb">Philippine National Bank</SelectItem>
                    <SelectItem value="unionbank">UnionBank</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="accountType">Account Type *</Label>
                <Select onValueChange={(value) => setValue("accountType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="checking">Checking Account</SelectItem>
                    <SelectItem value="current">Current Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                {...register("accountNumber", { required: "Account number is required" })}
                className={errors.accountNumber ? "border-red-500" : ""}
              />
              {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber.message}</p>}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanAmount">Loan Amount (₱) *</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  {...register("loanAmount", { required: "Loan amount is required" })}
                  className={errors.loanAmount ? "border-red-500" : ""}
                />
                {errors.loanAmount && <p className="text-red-500 text-sm mt-1">{errors.loanAmount.message}</p>}
              </div>
              <div>
                <Label htmlFor="loanTerm">Loan Term *</Label>
                <Select onValueChange={(value) => setValue("loanTerm", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="9">9 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="loanPurpose">Loan Purpose *</Label>
              <Select onValueChange={(value) => setValue("loanPurpose", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="working-capital">Working Capital</SelectItem>
                  <SelectItem value="equipment-purchase">Equipment Purchase</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="business-expansion">Business Expansion</SelectItem>
                  <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preferredPaymentDate">Preferred Payment Date *</Label>
              <Select onValueChange={(value) => setValue("preferredPaymentDate", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment date" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Reference 1</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="reference1Name">Full Name *</Label>
                  <Input
                    id="reference1Name"
                    {...register("reference1Name", { required: "Reference name is required" })}
                    className={errors.reference1Name ? "border-red-500" : ""}
                  />
                  {errors.reference1Name && (
                    <p className="text-red-500 text-sm mt-1">{errors.reference1Name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="reference1Relationship">Relationship *</Label>
                  <Input
                    id="reference1Relationship"
                    {...register("reference1Relationship", { required: "Relationship is required" })}
                    className={errors.reference1Relationship ? "border-red-500" : ""}
                  />
                  {errors.reference1Relationship && (
                    <p className="text-red-500 text-sm mt-1">{errors.reference1Relationship.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="reference1Contact">Contact Number *</Label>
                  <Input
                    id="reference1Contact"
                    {...register("reference1Contact", { required: "Contact number is required" })}
                    className={errors.reference1Contact ? "border-red-500" : ""}
                  />
                  {errors.reference1Contact && (
                    <p className="text-red-500 text-sm mt-1">{errors.reference1Contact.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Reference 2</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="reference2Name">Full Name *</Label>
                  <Input
                    id="reference2Name"
                    {...register("reference2Name", { required: "Reference name is required" })}
                    className={errors.reference2Name ? "border-red-500" : ""}
                  />
                  {errors.reference2Name && (
                    <p className="text-red-500 text-sm mt-1">{errors.reference2Name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="reference2Relationship">Relationship *</Label>
                  <Input
                    id="reference2Relationship"
                    {...register("reference2Relationship", { required: "Relationship is required" })}
                    className={errors.reference2Relationship ? "border-red-500" : ""}
                  />
                  {errors.reference2Relationship && (
                    <p className="text-red-500 text-sm mt-1">{errors.reference2Relationship.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="reference2Contact">Contact Number *</Label>
                  <Input
                    id="reference2Contact"
                    {...register("reference2Contact", { required: "Contact number is required" })}
                    className={errors.reference2Contact ? "border-red-500" : ""}
                  />
                  {errors.reference2Contact && (
                    <p className="text-red-500 text-sm mt-1">{errors.reference2Contact.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Upload Required Documents</h3>
              <p className="text-slate-600">Please upload clear, readable copies of all required documents</p>
            </div>

            <div className="grid gap-6">
              {[
                { category: "government-id", title: "Government ID", required: true },
                { category: "business-permit", title: "Business Permit", required: true },
                { category: "bir-certificate", title: "BIR Certificate", required: true },
                { category: "financial-statements", title: "Financial Statements", required: true },
                { category: "bank-statements", title: "Bank Statements (6 months)", required: true },
                { category: "proof-of-income", title: "Proof of Income", required: true },
                { category: "proof-of-billing", title: "Proof of Billing", required: false },
                { category: "other-documents", title: "Other Supporting Documents", required: false },
              ].map((doc) => (
                <Card key={doc.category}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">
                        {doc.title} {doc.required && <span className="text-red-500">*</span>}
                      </h4>
                      {uploadedFiles[doc.category] && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-2">Drag and drop files here or click to browse</p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(doc.category, e.target.files)}
                        className="hidden"
                        id={`file-${doc.category}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`file-${doc.category}`)?.click()}
                      >
                        Choose Files
                      </Button>
                      <p className="text-xs text-slate-500 mt-2">Supported formats: PDF, JPG, PNG (Max 5MB each)</p>
                    </div>

                    {uploadedFiles[doc.category] && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-slate-700 mb-2">Uploaded files:</p>
                        <div className="space-y-1">
                          {uploadedFiles[doc.category].map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                              <FileText className="w-4 h-4" />
                              <span>{file.name}</span>
                              <span className="text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Review Your Application</h3>
              <p className="text-slate-600">Please review all information before submitting</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {watch("firstName")} {watch("lastName")}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {watch("email")}
                    </div>
                    <div>
                      <span className="font-medium">Mobile:</span> {watch("mobileNumber")}
                    </div>
                    <div>
                      <span className="font-medium">Civil Status:</span> {watch("civilStatus")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Business Name:</span> {watch("businessName")}
                    </div>
                    <div>
                      <span className="font-medium">Business Type:</span> {watch("businessType")}
                    </div>
                    <div>
                      <span className="font-medium">Years in Business:</span> {watch("yearsInBusiness")}
                    </div>
                    <div>
                      <span className="font-medium">Employees:</span> {watch("numberOfEmployees")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loan Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Loan Amount:</span> ₱{watch("loanAmount")}
                    </div>
                    <div>
                      <span className="font-medium">Loan Term:</span> {watch("loanTerm")} months
                    </div>
                    <div>
                      <span className="font-medium">Purpose:</span> {watch("loanPurpose")}
                    </div>
                    <div>
                      <span className="font-medium">Monthly Income:</span> ₱{watch("monthlyIncome")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  {...register("termsAccepted", { required: "You must accept the terms and conditions" })}
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-orange-500 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  *
                </Label>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacyAccepted"
                  {...register("privacyAccepted", { required: "You must accept the privacy policy" })}
                />
                <Label htmlFor="privacyAccepted" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-orange-500 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  *
                </Label>
              </div>
              {errors.privacyAccepted && <p className="text-red-500 text-sm">{errors.privacyAccepted.message}</p>}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="creditCheckConsent"
                  {...register("creditCheckConsent", { required: "Credit check consent is required" })}
                />
                <Label htmlFor="creditCheckConsent" className="text-sm">
                  I consent to credit checks and verification of the information provided *
                </Label>
              </div>
              {errors.creditCheckConsent && <p className="text-red-500 text-sm">{errors.creditCheckConsent.message}</p>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Loan Application</CardTitle>
              <p className="text-slate-600 mt-1">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 mb-2">{Math.round(progress)}% Complete</div>
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep} className="bg-orange-500 hover:bg-orange-600">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Submit Application
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
