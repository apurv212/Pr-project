import React, { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, MessageCircle, ExternalLink, CheckCircle, Send, Upload, X, Paperclip, Image as ImageIcon } from "lucide-react";
import ReactGA from "react-ga4";

const Contact = ({ darkMode }) => {
  const contactRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState("");

  // File upload configuration
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 3;
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 5MB.`;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `File "${file.name}" type is not supported. Allowed: images, PDF, DOC, TXT.`;
    }
    return null;
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    
    if (selectedFiles.length + fileArray.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files allowed. Please remove some files first.`);
      return;
    }

    const validFiles = [];
    let hasError = false;

    for (const file of fileArray) {
      // Check for duplicates
      if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        setFileError(`File "${file.name}" is already selected.`);
        hasError = true;
        break;
      }

      const error = validateFile(file);
      if (error) {
        setFileError(error);
        hasError = true;
        break;
      }

      validFiles.push(file);
    }

    if (!hasError) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setFileError("");
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFileError("");
  };

  const handleFileInput = (event) => {
    if (event.target.files.length > 0) {
      handleFiles(event.target.files);
    }
  };

  // Drag and Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  // Clipboard paste handler
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const files = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }

    if (files.length > 0) {
      handleFiles(files);
      e.preventDefault(); // Prevent default paste behavior
    }
  };

  // Add paste event listener
  useEffect(() => {
    const handleDocumentPaste = (e) => {
      // Only handle paste if the contact form is visible/active
      if (contactRef.current?.contains(document.activeElement)) {
        handlePaste(e);
      }
    };

    document.addEventListener('paste', handleDocumentPaste);
    return () => document.removeEventListener('paste', handleDocumentPaste);
  }, [selectedFiles]);

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon size={16} className="text-blue-400" />;
    }
    return <Paperclip size={16} className="text-gray-400" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending....");
    
    const formData = new FormData(event.target);

    // Add access key for Web3Forms (current provider)
    formData.append("access_key", "ffa2a120-c980-40b6-9b96-7733cc9724e7");

    // Add files to form data
    selectedFiles.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });

    try {
      // Using Web3Forms (Note: File uploads require Pro plan)
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        setIsSuccess(true);
        setSelectedFiles([]); // Clear files
        event.target.reset();
        
        // Track form submission
        ReactGA.event({
          category: "Contact",
          action: "Form Submitted",
          label: "Contact Form with Files",
        });
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setResult("");
        }, 5000);
      } else {
        console.log("Error", data);
        setResult(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternative: FormSubmit (completely free with file support)
  const onSubmitWithFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending....");
    
    const formData = new FormData(event.target);
    
    // Add files to form data with unique names for FormSubmit multiple file support
    selectedFiles.forEach((file, index) => {
      formData.append(`attachment_${index + 1}`, file); // FormSubmit supports multiple attachments with unique names
    });

    try {
      // Using FormSubmit with the provided hash for security
      const response = await fetch("https://formsubmit.co/48f747f6191aa0bd541d060966a57236", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        setResult("Form Submitted Successfully");
        setIsSuccess(true);
        setSelectedFiles([]); // Clear files
        event.target.reset();
        
        // Track form submission
        ReactGA.event({
          category: "Contact",
          action: "Form Submitted",
          label: "Contact Form with Files (FormSubmit)",
        });
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
          setResult("");
        }, 5000);
      } else {
        setResult("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternative: Web3Forms Pro (if you upgrade) - Guaranteed multiple file support
  const onSubmitWithWeb3FormsPro = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending....");
    
    const formData = new FormData(event.target);
    formData.append("access_key", "ffa2a120-c980-40b6-9b96-7733cc9724e7");

    // Web3Forms Pro supports multiple files with same or different names
    selectedFiles.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setResult("Form Submitted Successfully");
        setIsSuccess(true);
        setSelectedFiles([]);
        event.target.reset();
        
        ReactGA.event({
          category: "Contact",
          action: "Form Submitted", 
          label: "Contact Form with Files (Web3Forms Pro)",
        });
        
        setTimeout(() => {
          setIsSuccess(false);
          setResult("");
        }, 5000);
      } else {
        setResult(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const elements = contactRef.current.querySelectorAll('.animate-item');
          elements.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('animate-in');
            }, index * 150);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current);
      }
    };
  }, []);

  return (
    <section
      id="contact"
      ref={contactRef}
      className={`py-20 ${
        darkMode ? "bg-indigo-950" : "bg-indigo-900"
      } text-white relative overflow-hidden`}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className={`absolute w-40 h-40 rounded-full ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} opacity-20 top-10 left-10 animate-float-slow`}></div>
        <div className={`absolute w-64 h-64 rounded-full ${darkMode ? "bg-indigo-700" : "bg-indigo-600"} opacity-10 bottom-20 right-20 animate-float`}></div>
        <div className={`absolute w-20 h-20 rounded-full ${darkMode ? "bg-purple-700" : "bg-purple-600"} opacity-20 top-40 right-40 animate-float-medium`}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 animate-item opacity-0 transition-all duration-700 transform translate-y-8">Get In Touch</h2>
        
        {/* Contact Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className={`${darkMode ? "bg-indigo-900/50" : "bg-indigo-800/50"} backdrop-blur-sm rounded-2xl p-8 shadow-2xl border ${darkMode ? "border-indigo-700/50" : "border-indigo-600/50"} animate-item opacity-0 transition-all duration-700 transform translate-y-8`}>
            <h3 className="text-2xl font-semibold mb-6 text-center">Send me a message</h3>
            
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center animate-pulse">
                <CheckCircle className="text-green-400 mr-2" size={24} />
                <span className="text-green-400 font-medium">Your message has been sent successfully!</span>
              </div>
            )}
            
            <form onSubmit={onSubmitWithFormSubmit} className="space-y-6" encType="multipart/form-data">
              {/* FormSubmit Configuration Fields */}
              <input type="hidden" name="_subject" value="New Portfolio Contact Form Submission" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode 
                        ? "bg-indigo-800/50 border-indigo-600 focus:border-indigo-400" 
                        : "bg-indigo-700/50 border-indigo-500 focus:border-indigo-300"
                    } border-2 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300 text-white placeholder-gray-300`}
                    placeholder="Your name"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode 
                        ? "bg-indigo-800/50 border-indigo-600 focus:border-indigo-400" 
                        : "bg-indigo-700/50 border-indigo-500 focus:border-indigo-300"
                    } border-2 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300 text-white placeholder-gray-300`}
                    placeholder="Your phone number"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={`w-full px-4 py-3 rounded-lg ${
                    darkMode 
                      ? "bg-indigo-800/50 border-indigo-600 focus:border-indigo-400" 
                      : "bg-indigo-700/50 border-indigo-500 focus:border-indigo-300"
                  } border-2 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300 text-white placeholder-gray-300`}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg ${
                    darkMode 
                      ? "bg-indigo-800/50 border-indigo-600 focus:border-indigo-400" 
                      : "bg-indigo-700/50 border-indigo-500 focus:border-indigo-300"
                  } border-2 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300 text-white placeholder-gray-300 resize-none`}
                  placeholder="Your message here..."
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Attachments (Optional)
                </label>
                <div
                  ref={dropZoneRef}
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                    isDragOver
                      ? darkMode
                        ? "border-indigo-400 bg-indigo-800/30"
                        : "border-indigo-300 bg-indigo-700/30"
                      : darkMode
                      ? "border-indigo-600 bg-indigo-800/20"
                      : "border-indigo-500 bg-indigo-700/20"
                  } hover:border-indigo-400 cursor-pointer`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  
                  <Upload className="mx-auto mb-3 text-indigo-300" size={32} />
                  <p className="text-sm text-indigo-200 mb-2">
                    {isDragOver ? "Drop files here" : "Drag & drop files here, or click to browse"}
                  </p>
                  <p className="text-xs text-indigo-300">
                    Or paste from clipboard (Ctrl+V) • Max {MAX_FILES} files, 5MB each
                  </p>
                  <p className="text-xs text-indigo-400 mt-1">
                    Supports: Images, PDF, DOC, TXT
                  </p>
                </div>

                {/* File Error */}
                {fileError && (
                  <div className="mt-2 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
                    {fileError}
                  </div>
                )}

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-indigo-200">Selected files:</p>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          darkMode ? "bg-indigo-800/30" : "bg-indigo-700/30"
                        } border border-indigo-600/50`}
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="text-sm font-medium text-white truncate max-w-[200px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-indigo-300">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-red-500/20 rounded-full transition-colors duration-200"
                          disabled={isSubmitting}
                        >
                          <X size={16} className="text-red-400 hover:text-red-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                  isSubmitting
                    ? "bg-gray-600 cursor-not-allowed"
                    : darkMode
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-105"
                    : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 hover:scale-105"
                } text-white shadow-lg hover:shadow-xl`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send Message
                    {selectedFiles.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                        +{selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </>
                )}
              </button>
            </form>
            
            {result && !isSuccess && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                result.includes("Error") || result.includes("wrong")
                  ? "bg-red-500/20 border border-red-500/50 text-red-400"
                  : "bg-blue-500/20 border border-blue-500/50 text-blue-400"
              }`}>
                {result}
              </div>
            )}
          </div>
        </div>
        
        {/* Social Links */}
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-y-8 gap-x-12">
            <a
              href="mailto:sharshit416@gmail.com"
              className="flex items-center group animate-item opacity-0 transition-all duration-500 transform translate-y-6"
              onClick={() =>
                ReactGA.event({
                  category: "Contact",
                  action: "Clicked Email Link",
                  label: "Email",
                })
              }
            >
              <div className={`p-3 rounded-full mr-3 ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} group-hover:scale-110 transition-all duration-300`}>
                <Mail className="group-hover:text-indigo-300 transition-colors" size={20} />
              </div>
              <span className="group-hover:text-indigo-300 transition-colors">
                sharshit416@gmail.com
              </span>
            </a>
            
            <a
              href="http://www.linkedin.com/in/apurv-s-023564269"
              className="flex items-center group animate-item opacity-0 transition-all duration-500 transform translate-y-6"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                ReactGA.event({
                  category: "Contact",
                  action: "Clicked LinkedIn Link",
                  label: "LinkedIn",
                })
              }
            >
              <div className={`p-3 rounded-full mr-3 ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} group-hover:scale-110 transition-all duration-300`}>
                <Linkedin className="group-hover:text-indigo-300 transition-colors" size={20} />
              </div>
              <span className="group-hover:text-indigo-300 transition-colors">
                LinkedIn
              </span>
            </a>
            
            <a
              href="https://github.com/apurv212"
              className="flex items-center group animate-item opacity-0 transition-all duration-500 transform translate-y-6"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                ReactGA.event({
                  category: "Contact",
                  action: "Clicked GitHub Link",
                  label: "GitHub",
                })
              }
            >
              <div className={`p-3 rounded-full mr-3 ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} group-hover:scale-110 transition-all duration-300`}>
                <Github className="group-hover:text-indigo-300 transition-colors" size={20} />
              </div>
              <span className="group-hover:text-indigo-300 transition-colors">
                GitHub
              </span>
            </a>
            
            <a
              href="https://wa.me/+917677672641"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center group animate-item opacity-0 transition-all duration-500 transform translate-y-6"
              onClick={() =>
                ReactGA.event({
                  category: "Contact",
                  action: "Clicked WhatsApp Link",
                  label: "WhatsApp",
                })
              }
            >
              <div className={`p-3 rounded-full mr-3 ${darkMode ? "bg-indigo-800" : "bg-indigo-700"} group-hover:scale-110 transition-all duration-300`}>
                <MessageCircle className="group-hover:text-indigo-300 transition-colors" size={20} />
              </div>
              <span className="group-hover:text-indigo-300 transition-colors">
                WhatsApp
              </span>
            </a>
          </div>
          
          <div className="mt-16 text-center">
            <p className="mb-8 animate-item opacity-0 transition-all duration-500 transform translate-y-6 max-w-lg mx-auto">
              I'm always open to discussing new projects, opportunities or
              partnerships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-item opacity-0 transition-all duration-500 transform translate-y-6">
              <button
                className={`px-8 py-3 rounded-full transition-all duration-300 font-medium hover:scale-105 shadow-lg ${
                  darkMode
                    ? "bg-gray-200 text-indigo-950 hover:bg-white"
                    : "bg-white text-indigo-900 hover:bg-gray-100"
                }`}
              >
                <a
                  href="/apurv_shashvat_resume25.pdf"
                  download="apurv_shashvat.pdf"
                  className="w-full h-full inline-block"
                  onClick={() =>
                    ReactGA.event({
                      category: "Resume",
                      action: "Downloaded Resume",
                      label: "Resume Download",
                    })
                  }
                >
                  Download Resume
                </a>
              </button>
              
              <a
                href="https://linktr.ee/apurv_shashvat"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-3 rounded-full transition-all duration-300 font-medium hover:scale-105 shadow-lg flex items-center justify-center ${
                  darkMode
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                }`}
                onClick={() =>
                  ReactGA.event({
                    category: "Contact",
                    action: "Clicked Linktree Profile",
                    label: "Detailed Profile",
                  })
                }
              >
                <span>Detailed Profile</span>
                <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;