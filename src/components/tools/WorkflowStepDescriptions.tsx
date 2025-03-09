// Crow Workflow Step Descriptions
// This component provides detailed explanations for each step in the Crow workflow
// To use: Import this component and include it in the relevant workflow step pages
// Example usage in a page component:
/*
import WorkflowStepDescriptions from './components/WorkflowStepDescriptions';

const ReceivePage = () => {
  return (
    <div>
      <WorkflowStepDescriptions step="receive" />
    </div>
  );
};
*/

import React from 'react';

// Define the possible workflow step types
type WorkflowStep = 'Provision' | 'Receive' | 'Deploy' | 'CheckStatus' | 'SuspendReactivate' | 'Replace' | 'Transfer' | 'Retire';

// Define the component props interface
interface WorkflowStepDescriptionsProps {
  step: WorkflowStep;
}

const WorkflowStepDescriptions: React.FC<WorkflowStepDescriptionsProps> = ({ step }) => {
  // Content for each workflow step
  const stepDescriptions = {
    Provision: {
      title: "About Provisioning Your Crow",
      cards: [
        {
          heading: "What is Provisioning?",
          content: "Provisioning is the initial setup process that occurs after CLS' hardened OS image and supportive feature libraries have been installed. This process uploads your unique Crow ID to the Crow Management service, creating the foundation for secure device identification."
        },
        {
          heading: "How Crow IDs Work",
          content: "Each Crow ID is derived through a dmiDecode request for the appliance's serial number or alternatively using the MAC address from the first network interface. The ID must be unique across the service as it's the foundational mechanism for identifying your specific Crow appliance."
        },
        {
          heading: "After Provisioning",
          content: "Once provisioning is complete, your Crow is ready to be received at a CLS supported facility. Provisioning can be done in bulk at the manufacturing facility or as a one-off process when necessary."
        }
      ]
    },
    
    Receive: {
      title: "About Receiving Your Crow",
      cards: [
        {
          heading: "The Receiving Process",
          content: "Receiving occurs when a Crow arrives at a CLS supported facility. Simply scan the QR code from the Crow's case or manually enter the ID number displayed, then select the appropriate Site ID from the options provided."
        },
        {
          heading: "Site Association",
          content: "Associating the Crow to a site is a critical security step. If your site isn't listed, select \"Site ID not Listed\" and manually enter your Site ID. This creates the necessary security association between your Crow and its designated facility."
        },
        {
          heading: "After Receiving",
          content: "Once received, your Crow can be stored until it's ready to be deployed to protect a work cell. To move a Crow between different sites later, you'll need to use the Transfer workflow."
        }
      ]
    },
    
    Deploy: {
      title: "About Deploying Your Crow",
      cards: [
        {
          heading: "Why Deploy to a Work Cell?",
          content: "Deploying your Crow to a specific Work Cell enables real-time monitoring and protection. This association allows the Crow to create a secure network segment for your operational technology, protecting critical industrial systems from external threats."
        },
        {
          heading: "Deployment Process",
          content: "Start with the Crow powered off. After submitting the required IDs through the form, connect both public and private network cables, then power on the Crow. It will automatically retrieve its configuration and begin protecting your work cell within 15 minutes."
        },
        {
          heading: "What You'll Need",
          content: "Before deploying, ensure you have your unique Crow ID, the Site ID where your device is installed, and the specific Work Cell ID. These identifiers create a secure connection between your Crow device and the monitoring system."
        }
      ]
    },
    
    CheckStatus: {
      title: "About Checking Crow Status",
      cards: [
        {
          heading: "Status Monitoring",
          content: "You can check a Crow's operational status at any time by submitting the Crow ID to the system. This provides real-time information about your Crow's connectivity and protection capabilities."
        },
        {
          heading: "What Status Tells You",
          content: "The status check reveals whether your Crow is properly connected, actively protecting your work cell, and successfully communicating with the Crow Management service."
        },
        {
          heading: "When to Check Status",
          content: "Regular status checks are recommended as part of your security routine. Additionally, check status after any network changes, power events, or if you suspect any issues with your work cell protection."
        }
      ]
    },
    
    SuspendReactivate: {
      title: "About Suspending and Reactivating Your Crow",
      cards: [
        {
          heading: "Automatic Monitoring",
          content: "Once deployed, your Crow checks in with the management service every 30 minutes (default, configurable). If it fails to check in twice consecutively, the system automatically creates a ticket with the custodial team's CTI."
        },
        {
          heading: "Planned Maintenance",
          content: "If your Crow, work cell, or site has planned maintenance that will impact the Crow's ability to check in, you can suspend check-in monitoring for up to 12 hours to prevent unnecessary alerts."
        },
        {
          heading: "Reactivation Process",
          content: "Once maintenance is complete, reactivate the Crow's check-in monitoring through the same form. This ensures continuous protection and monitoring of your critical operational technology."
        }
      ]
    },
    
    Replace: {
      title: "About Replacing Your Crow",
      cards: [
        {
          heading: "When to Replace",
          content: "The Replace workflow is used when a Crow fails or when a work cell needs a higher capacity device. This process assigns a new Crow to a work cell that's already being serviced by an existing one."
        },
        {
          heading: "Replacement Process",
          content: "Submit the existing Crow ID, Site ID, Work Cell ID, and the new Crow ID. After confirmation of successful replacement, carefully disconnect the existing Crow's network cables one at a time and connect them to the new Crow."
        },
        {
          heading: "After Replacement",
          content: "Once properly connected to power and network, the new Crow will be ready to provide service to the work cell within 15 minutes. The protection of your operational technology continues with minimal disruption."
        }
      ]
    },
    
    Transfer: {
      title: "About Transferring Your Crow",
      cards: [
        {
          heading: "Transfer Process",
          content: "The Transfer workflow disassociates a Crow from its current facility and returns it to the \"provisioned\" state. This is essential when moving a Crow between different facilities."
        },
        {
          heading: "Why Transfer Matters",
          content: "Properly transferring your Crow maintains the security architecture of the Crow Management Service and ensures that devices are correctly associated with their current physical locations."
        },
        {
          heading: "After Transfer",
          content: "Once transferred, the Crow can be shipped to the new facility where it will go through the standard \"receive\" process. This maintains the proper chain of custody for your security appliance."
        }
      ]
    },
    
    Retire: {
      title: "About Retiring Your Crow",
      cards: [
        {
          heading: "When to Retire",
          content: "If a Crow fails and cannot be revived, the Retire workflow should be performed. This permanently disassociates the device from the Crow Management Service."
        },
        {
          heading: "Retirement Process",
          content: "Simply submit the Crow ID and Site ID to retire the Crow. This process is only available to personnel with elevated privileges, as retirement is an irreversible step without CLS assistance."
        },
        {
          heading: "After Retirement",
          content: "Once retired, the Crow ID is permanently removed from active service. If the physical device is recoverable, it would need to go through the provisioning process again with a new Crow ID."
        }
      ]
    }
  };

  // Render component with selected step information
  const selectedStep = stepDescriptions[step as keyof typeof stepDescriptions] || stepDescriptions.Deploy;

  return (
    <div className="max-w-3xl mx-auto mt-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-200 to-blue-200 text-transparent bg-clip-text">
        {selectedStep.title}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div className="bg-slate-800/60 p-6 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-cyan-200 mb-3">{selectedStep.cards[0].heading}</h3>
          <p className="text-gray-300">
            {selectedStep.cards[0].content}
          </p>
        </div>
        
        <div className="bg-slate-800/60 p-6 rounded-lg border border-cyan-900/30 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-cyan-200 mb-3">{selectedStep.cards[1].heading}</h3>
          <p className="text-gray-300">
            {selectedStep.cards[1].content}
          </p>
        </div>
      </div>
      
      <div className="bg-slate-800/60 p-6 rounded-lg border border-cyan-900/30 backdrop-blur-sm mt-8">
        <h3 className="text-xl font-semibold text-cyan-200 mb-3">{selectedStep.cards[2].heading}</h3>
        <p className="text-gray-300">
          {selectedStep.cards[2].content}
        </p>
      </div>
    </div>
  );
};

export default WorkflowStepDescriptions;