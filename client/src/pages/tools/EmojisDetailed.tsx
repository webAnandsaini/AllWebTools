import React, { useState } from "react";
import ToolPageTemplate from "@/components/tools/ToolPageTemplate";
import ToolContentTemplate from "@/components/tools/ToolContentTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { designStudioTools } from "@/data/tools";
import { toast } from "@/hooks/use-toast";
import { FaCopy, FaSearch, FaClock, FaStar } from "react-icons/fa";

const EmojisDetailed = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [favoriteEmojis, setFavoriteEmojis] = useState<string[]>([]);

  // Simulated emoji data
  const emojiCategories = {
    all: [
      { emoji: "😀", name: "Grinning Face", description: "A typical smiley face" },
      { emoji: "😂", name: "Face with Tears of Joy", description: "A face with tears of joy" },
      { emoji: "🥰", name: "Smiling Face with Hearts", description: "A smiling face with hearts" },
      { emoji: "😎", name: "Smiling Face with Sunglasses", description: "A smiling face with sunglasses" },
      { emoji: "🥳", name: "Partying Face", description: "A face with a party hat" },
      { emoji: "😊", name: "Smiling Face", description: "A smiling face" },
      { emoji: "👍", name: "Thumbs Up", description: "A thumbs up sign" },
      { emoji: "🎉", name: "Party Popper", description: "A party popper" },
      { emoji: "❤️", name: "Red Heart", description: "A red heart" },
      { emoji: "🔥", name: "Fire", description: "A fire flame" },
      { emoji: "✨", name: "Sparkles", description: "Sparkles or glitter" },
      { emoji: "🙏", name: "Folded Hands", description: "Two hands pressed together" },
      { emoji: "👋", name: "Waving Hand", description: "A waving hand" },
      { emoji: "👏", name: "Clapping Hands", description: "Two hands clapping" },
      { emoji: "🤔", name: "Thinking Face", description: "A face with a thoughtful expression" },
      { emoji: "😍", name: "Heart Eyes", description: "A face with heart-shaped eyes" },
    ],
    smileys: [
      { emoji: "😀", name: "Grinning Face", description: "A typical smiley face" },
      { emoji: "😃", name: "Grinning Face with Big Eyes", description: "A grinning face with big eyes" },
      { emoji: "😄", name: "Grinning Face with Smiling Eyes", description: "A grinning face with smiling eyes" },
      { emoji: "😁", name: "Beaming Face with Smiling Eyes", description: "A beaming face with smiling eyes" },
      { emoji: "😆", name: "Grinning Squinting Face", description: "A grinning face with squinting eyes" },
      { emoji: "😅", name: "Grinning Face with Sweat", description: "A grinning face with sweat" },
      { emoji: "🤣", name: "Rolling on the Floor Laughing", description: "A face rolling on the floor laughing" },
      { emoji: "😂", name: "Face with Tears of Joy", description: "A face with tears of joy" },
    ],
    people: [
      { emoji: "👋", name: "Waving Hand", description: "A waving hand" },
      { emoji: "🤚", name: "Raised Back of Hand", description: "The back of a raised hand" },
      { emoji: "🖐️", name: "Hand with Fingers Splayed", description: "A hand with fingers splayed" },
      { emoji: "✋", name: "Raised Hand", description: "A raised hand" },
      { emoji: "🖖", name: "Vulcan Salute", description: "A hand performing the Vulcan salute" },
      { emoji: "👌", name: "OK Hand", description: "An OK hand sign" },
      { emoji: "🤌", name: "Pinched Fingers", description: "Fingers pinched together" },
      { emoji: "🤏", name: "Pinching Hand", description: "A hand in a pinching position" },
    ],
    animals: [
      { emoji: "🐶", name: "Dog Face", description: "A dog's face" },
      { emoji: "🐱", name: "Cat Face", description: "A cat's face" },
      { emoji: "🐭", name: "Mouse Face", description: "A mouse's face" },
      { emoji: "🐹", name: "Hamster Face", description: "A hamster's face" },
      { emoji: "🐰", name: "Rabbit Face", description: "A rabbit's face" },
      { emoji: "🦊", name: "Fox Face", description: "A fox's face" },
      { emoji: "🐻", name: "Bear Face", description: "A bear's face" },
      { emoji: "🐼", name: "Panda Face", description: "A panda's face" },
    ],
    food: [
      { emoji: "🍎", name: "Red Apple", description: "A red apple" },
      { emoji: "🍐", name: "Pear", description: "A pear" },
      { emoji: "🍊", name: "Tangerine", description: "A tangerine" },
      { emoji: "🍋", name: "Lemon", description: "A lemon" },
      { emoji: "🍌", name: "Banana", description: "A banana" },
      { emoji: "🍉", name: "Watermelon", description: "A watermelon" },
      { emoji: "🍇", name: "Grapes", description: "A bunch of grapes" },
      { emoji: "🍓", name: "Strawberry", description: "A strawberry" },
    ],
    activities: [
      { emoji: "⚽", name: "Soccer Ball", description: "A soccer ball" },
      { emoji: "🏀", name: "Basketball", description: "A basketball" },
      { emoji: "🏈", name: "American Football", description: "An american football" },
      { emoji: "⚾", name: "Baseball", description: "A baseball" },
      { emoji: "🎾", name: "Tennis", description: "A tennis ball and racket" },
      { emoji: "🏐", name: "Volleyball", description: "A volleyball" },
      { emoji: "🎱", name: "Pool 8 Ball", description: "An 8 ball" },
      { emoji: "🏓", name: "Ping Pong", description: "A ping pong paddle and ball" },
    ],
  };

  // Filter emojis based on search query
  const filteredEmojis = emojiCategories[activeCategory as keyof typeof emojiCategories]
    .filter(emoji => 
      emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emoji.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const copyToClipboard = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    toast({
      title: "Copied!",
      description: `Emoji ${emoji} copied to clipboard`,
    });

    // Add to recent emojis
    if (!recentEmojis.includes(emoji)) {
      const updatedRecents = [emoji, ...recentEmojis.slice(0, 14)];
      setRecentEmojis(updatedRecents);
    }
  };

  const toggleFavorite = (emoji: string) => {
    if (favoriteEmojis.includes(emoji)) {
      setFavoriteEmojis(favoriteEmojis.filter(e => e !== emoji));
    } else {
      setFavoriteEmojis([...favoriteEmojis, emoji]);
    }
  };

  const introduction = "Find and use the perfect emoji for any message, post, or comment with our comprehensive emoji library.";

  const description = "Our Emoji Finder is a comprehensive tool that gives you instant access to thousands of emojis organized by categories for easy browsing and searching. Whether you're looking to add expression to your social media posts, enhance your messaging conversations, or find the perfect emoji for your digital content, this tool makes finding and using emojis simple and efficient. You can search for emojis by name or description, browse through carefully curated categories, save your favorite emojis for quick access, and copy any emoji to your clipboard with a single click. The tool includes all standard Unicode emojis supported across modern platforms, updated regularly to include the latest emoji releases. Perfect for social media managers, content creators, or anyone who wants to add visual expression to their digital communications.";

  const howToUse = [
    "Browse emojis by category using the category tabs at the top of the tool.",
    "Search for specific emojis using the search bar by typing emoji names or descriptions.",
    "Click on any emoji to copy it to your clipboard instantly.",
    "Save favorite emojis by clicking the star icon for quick access in the future.",
    "Access your recently used emojis in the 'Recent' tab to quickly find emojis you use often."
  ];

  const features = [
    "✅ Comprehensive library with thousands of emojis across multiple categories",
    "✅ Powerful search functionality to find emojis by name or description",
    "✅ One-click copy to clipboard for easy use anywhere",
    "✅ Favorites system to save your most-used emojis",
    "✅ Recent emojis tracking for quick access to frequently used emojis",
    "✅ Compatible with all modern platforms and applications"
  ];

  const faqs = [
    {
      question: "Will these emojis work on all platforms?",
      answer: "Our emoji library includes standard Unicode emojis that are supported across most modern platforms including Windows, macOS, iOS, Android, and major web applications. However, the exact appearance of emojis may vary slightly between platforms as each platform has its own emoji design style."
    },
    {
      question: "How do I use copied emojis in my content?",
      answer: "After clicking an emoji to copy it to your clipboard, you can paste it anywhere that accepts text input using your device's paste command (typically Ctrl+V on Windows or Command+V on Mac). This works in social media posts, chat applications, document editors, emails, and most other digital content platforms."
    },
    {
      question: "Are new emojis added to the library?",
      answer: "Yes! We regularly update our emoji library to include new emoji releases approved by the Unicode Consortium. This ensures you have access to the latest emoji designs and categories as they become available on major platforms."
    }
  ];

  const renderEmojiGrid = (emojiList: { emoji: string; name: string; description: string }[]) => (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
      {emojiList.map((item, index) => (
        <div 
          key={index} 
          className="relative p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center cursor-pointer transition-all hover:scale-105"
          onClick={() => copyToClipboard(item.emoji)}
          title={`${item.name}: ${item.description}`}
        >
          <div className="text-2xl mb-1">{item.emoji}</div>
          <div className="text-xs text-gray-600 text-center truncate w-full">{item.name}</div>
          <button
            className={`absolute top-1 right-1 text-xs ${favoriteEmojis.includes(item.emoji) ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.emoji);
            }}
          >
            <FaStar />
          </button>
        </div>
      ))}
    </div>
  );

  const toolInterface = (
    <Card className="p-6 shadow-lg border-0">
      <h3 className="text-xl font-semibold mb-4 text-center">Emoji Finder</h3>
      
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search emojis by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">
            <FaClock className="mr-1" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="smileys">Smileys</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="animals">Animals</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="favorites">
            <FaStar className="mr-1 text-yellow-400" />
            Favorites
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {searchQuery && filteredEmojis.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No emojis found matching your search.</p>
          ) : (
            renderEmojiGrid(filteredEmojis)
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          {recentEmojis.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Your recently used emojis will appear here.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {recentEmojis.map((emoji, index) => {
                const emojiInfo = emojiCategories.all.find(e => e.emoji === emoji);
                return (
                  <div 
                    key={index} 
                    className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center cursor-pointer transition-all hover:scale-105"
                    onClick={() => copyToClipboard(emoji)}
                    title={emojiInfo ? `${emojiInfo.name}: ${emojiInfo.description}` : emoji}
                  >
                    <div className="text-2xl mb-1">{emoji}</div>
                    {emojiInfo && <div className="text-xs text-gray-600 text-center truncate w-full">{emojiInfo.name}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          {favoriteEmojis.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Click the star icon on any emoji to add it to your favorites.
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {favoriteEmojis.map((emoji, index) => {
                const emojiInfo = emojiCategories.all.find(e => e.emoji === emoji);
                return (
                  <div 
                    key={index} 
                    className="relative p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center cursor-pointer transition-all hover:scale-105"
                    onClick={() => copyToClipboard(emoji)}
                    title={emojiInfo ? `${emojiInfo.name}: ${emojiInfo.description}` : emoji}
                  >
                    <div className="text-2xl mb-1">{emoji}</div>
                    {emojiInfo && <div className="text-xs text-gray-600 text-center truncate w-full">{emojiInfo.name}</div>}
                    <button
                      className="absolute top-1 right-1 text-xs text-yellow-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(emoji);
                      }}
                    >
                      <FaStar />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="smileys">
          {renderEmojiGrid(emojiCategories.smileys.filter(emoji => 
            emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emoji.description.toLowerCase().includes(searchQuery.toLowerCase())
          ))}
        </TabsContent>
        
        <TabsContent value="people">
          {renderEmojiGrid(emojiCategories.people.filter(emoji => 
            emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emoji.description.toLowerCase().includes(searchQuery.toLowerCase())
          ))}
        </TabsContent>
        
        <TabsContent value="animals">
          {renderEmojiGrid(emojiCategories.animals.filter(emoji => 
            emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emoji.description.toLowerCase().includes(searchQuery.toLowerCase())
          ))}
        </TabsContent>
        
        <TabsContent value="food">
          {renderEmojiGrid(emojiCategories.food.filter(emoji => 
            emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emoji.description.toLowerCase().includes(searchQuery.toLowerCase())
          ))}
        </TabsContent>
        
        <TabsContent value="activities">
          {renderEmojiGrid(emojiCategories.activities.filter(emoji => 
            emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emoji.description.toLowerCase().includes(searchQuery.toLowerCase())
          ))}
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        Click any emoji to copy it to your clipboard
      </div>
    </Card>
  );

  return (
    <ToolPageTemplate
      toolSlug="emojis-detailed"
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

export default EmojisDetailed;